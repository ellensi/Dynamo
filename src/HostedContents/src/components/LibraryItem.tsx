/*
      LibraryItemContainerXxx(Category/Group/None)
    +---------------------------------------------------+
    |   LibraryItemHeader                               |
    | +-----------------------------------------------+ |
    | | +-----------------+ +-----------------------+ | |
    | | | LibraryItemIcon | | LibraryItemText       | | |
    | | +-----------------+ +-----------------------+ | |
    | +-----------------------------------------------+ |
    |   LibraryItemBody                                 |
    | +-----------------------------------------------+ |
    | |                                               | |
    | |                                               | |
    | +-----------------------------------------------+ |
    +---------------------------------------------------+

*/

import * as React from "react";
import { ClusterView } from "./ClusterView";

export class ItemData {
    text: string;
    iconName: string;
    expanded: boolean;
    itemType: string;
    childItems: ItemData[];
}

export interface LibraryItemProps { data: ItemData }
export interface LibraryItemState { expanded: boolean }

export class LibraryItem extends React.Component<LibraryItemProps, LibraryItemState> {

    constructor(props: LibraryItemProps) {
        super(props);
        this.state = { expanded: false }; // Assign initial state
    }

    render() {

        let iconPath = "/src/resources/icons/" + this.props.data.iconName + ".png";

        let iconElement = null;
        let libraryItemTextStyle = "LibraryItemGroupText";

        if (this.props.data.itemType != "group") { // Group displays only text without icon.
            libraryItemTextStyle = "LibraryItemText";
            iconElement = (<img className={ "LibraryItemIcon" } src={ iconPath } />);
        }

        let nestedElements = null;

        if (this.state.expanded) // Show only nested elements when expanded.
        {
            if (this.props.data.childItems) {
                if (this.props.data.childItems.some(this.isLeafItem)) {
                    // There are some leaf nodes (e.g. methods).
                    nestedElements = this.getClusteredElements();
                } else {
                    // There are intermediate child items.
                    nestedElements = this.getNestedElements();
                }
            }
        }        

        return (
            <div className={ this.getLibraryItemContainerStyle() }>
                <div className={ "LibraryItemHeader" } onClick={ this.onLibraryItemClicked.bind(this) } >
                    { iconElement }
                    <div className={ libraryItemTextStyle }>{ this.props.data.text }</div>
                </div>
                { nestedElements }
            </div>
        );
    }

    getLibraryItemContainerStyle(): string {

        switch(this.props.data.itemType) {
            case "category":
                return "LibraryItemContainerCategory";

            case "group":
                return "LibraryItemContainerGroup";

            case "none":
            case "creation":
            case "action":
            case "query":
                return "LibraryItemContainerNone";
        }

        return "LibraryItemContainerNone";
    }

    getNestedElements(): any {

        let index = 0;
        return (
            <div className={ "LibraryItemBody" }>
            {
                this.props.data.childItems.map((item: ItemData) => {
                    return (<LibraryItem key={ index++ } data={ item } />);
                })
            }
            </div>
        );
    }

    getClusteredElements(): any {
        
        let items = this.props.data.childItems;
        let creationMethods = items.filter((item: ItemData) => item.itemType == "creation");
        let actionMethods = items.filter((item: ItemData) => item.itemType == "action");
        let queryMethods = items.filter((item: ItemData) => item.itemType == "query");

        let creationCluster = null;
        if (creationMethods.length > 0) {
            creationCluster = (<ClusterView
                iconPath="src/resources/icons/library-creation.svg"
                borderColor="#62895b" /* green */
                childItems={ creationMethods } />);
        }

        let actionCluster = null;
        if (actionMethods.length > 0) {
            actionCluster = (<ClusterView
                iconPath="src/resources/icons/library-action.svg"
                borderColor="#ad5446" /* red */
                childItems={ actionMethods } />);
        }

        let queryCluster = null;
        if (queryMethods.length > 0) {
            queryCluster = (<ClusterView
                iconPath="src/resources/icons/library-query.svg"
                borderColor="#4b9dbf" /* blue */
                childItems={ queryMethods } />);
        }

        return (
            <div className={ "LibraryItemBody" }>
                { creationCluster }
                { actionCluster }
                { queryCluster }
            </div>
        );
    }

    isLeafItem(item: ItemData): boolean {
        return ((item.itemType == "creation") || 
                (item.itemType == "action") ||
                (item.itemType == "query"));
    }

    onLibraryItemClicked() {

        // Toggle expansion state.
        let currentlyExpanded = this.state.expanded;
        this.setState({ expanded: !currentlyExpanded });
    }
}