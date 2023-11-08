import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableService } from 'src/app/service/table.service';

declare type Nullable<T = void> = T | null | undefined;


interface TreeNode<T = any> {
  /**
   * Label of the node.
   */
  label?: string;
  /**
   * Data represented by the node.
   */
  data?: T;
  /**
   * Icon of the node to display next to content.
   */
  icon?: string;
  /**
   * Icon to use in expanded state.
   */
  expandedIcon?: string;
  /**
   * Icon to use in collapsed state.
   */
  collapsedIcon?: string;
  /**
   * An array of treenodes as children.
   */
  children?: TreeNode<T>[];
  /**
   * Specifies if the node has children. Used in lazy loading.
   * @defaultValue false
   */
  leaf?: boolean;
  /**
   * Expanded state of the node.
   * @defaultValue false
   */
  expanded?: boolean;
  /**
   * Type of the node to match a template.
   */
  type?: string;
  /**
   * Parent of the node.
   */
  parent?: TreeNode<T>;
  /**
   * Defines if value is partially selected.
   */
  partialSelected?: boolean;
  /**
   * Inline style of the node.
   */
  style?: any;
  /**
   * Style class of the node.
   */
  styleClass?: string;
  /**
   * Defines if the node is draggable.
   */
  draggable?: boolean;
  /**
   * Defines if the node is droppable.
   */
  droppable?: boolean;
  /**
   * Whether the node is selectable when selection mode is enabled.
   * @defaultValue false
   */
  selectable?: boolean;
  /**
   * Mandatory unique key of the node.
   */
  key?: string;
  parents_node_ids? : Array<any>;
}

interface TreeTableNode<T = any> extends TreeNode {
  /**
   * Browser event.
   */
  originalEvent?: Event;
  /**
   * Row of the node.
   */
  rowNode?: any;
  /**
   * Node instance.
   */
  node?: TreeNode<T>;
  /**
   * Selection type.
   */
  type?: string;
  /**
   * Node index.
   */
  index?: number;
  /**
   * Node level.
   */
  level?: number;
  /**
   * Boolean value indicates if node is in viewport.
   */
  visible?: boolean;

  parents_node_ids?: Array<any>; 
}

@Component({
  selector: 'cs-table-tree',
  templateUrl: './table-tree.component.html',
  styleUrls: ['./table-tree.component.scss']
})
export class TableTreeComponent implements OnInit {

  _data: Array<any> = [];

  table_data: Array<any> = [];

  columns = [{
      'label': 'Brand',
      'name': 'brand'
    },
    {
      'label': 'Last Year Sale',
      'name': 'lastYearSale'
    },
    {
      'label' : 'Last Year Profit',
      'name' : 'lastYearProfit'
    }
  ]

  constructor(private tableService: TableService, private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.tableService.getData().subscribe((x) => {
      this._data = x;
      this.serializeNodes(null, this._data, 0, true , -1);
    })
  }

  serializeNodes(parent: Nullable<TreeTableNode>, nodes: Nullable<TreeNode[]>, level: Nullable<number>, visible: Nullable<boolean>, parent_index:Nullable<number>) {
    if (nodes && nodes.length) { 
      nodes.forEach((value, index)=>{
        let parents_node_ids = value.parents_node_ids !== undefined ? value.parents_node_ids : [];
        if(parent){
          parents_node_ids.push(parent_index)
        }
        value.parent = <TreeTableNode>parent;
        const rowNode = {
          node: value.data,
          index : index,
          parents_node_ids : parents_node_ids,
          level: level,
          expanded: value.expanded,
          visible: visible && (parent ? parent.expanded : true)
        };
        (<TreeNode[]>this.table_data).push(<TreeTableNode>rowNode);
        if (rowNode.visible && value.expanded && value.children) {
          this.serializeNodes(value, value.children, <number>level + 1,  rowNode.visible, index);
        }
      });
    }
    this.cd.markForCheck();
  }
  clickElement(row : TreeTableNode){
    row.expanded = !row.expanded;
    console.log(row.expanded)
    if(row.index!==undefined){
      this._data[row.index]['expanded'] = row.expanded;
    }
    this.table_data = [];
    this.serializeNodes(null, this._data, 0, true, -1);
    console.log(row.index)
  }
}
