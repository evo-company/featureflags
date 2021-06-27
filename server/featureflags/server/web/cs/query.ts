import {hiku} from "./proto";
import IItem = hiku.protobuf.query.IItem;
import Item = hiku.protobuf.query.Item;
import INode = hiku.protobuf.query.INode;
import Node = hiku.protobuf.query.Node;

import {google} from "./proto";
import IStruct = google.protobuf.IStruct;

export class G {
    static node(items: IItem[]): Node {
        return Node.create({items});
    }
    static field(name: string): IItem {
        return Item.create({field: {name}});
    }
    static link(name: string, node: INode, options?: IStruct): IItem {
        return Item.create({link: {name, node, options}});
    }
}

export const FLAG_NODE_MIN = G.node([
    G.field('id'),
    G.field('name'),
    G.link('project', G.node([
        G.field('id'),
        G.field('name'),
    ])),
]);

export const PROJECT_NODE = G.node([
    G.field('id'),
    G.field('name'),
    G.link('variables', G.node([
        G.field('id'),
        G.field('name'),
        G.field('type'),
    ])),
]);

export const FLAG_NODE_FULL = G.node([
    G.field('id'),
    G.field('name'),
    G.link('project', G.node([
        G.field('id'),
        G.field('name'),
    ])),
    G.field('enabled'),
    G.field('overridden'),
    G.link('conditions', G.node([
        G.field('id'),
        G.link('checks', G.node([
            G.field('id'),
            G.link('variable', G.node([
                G.field('id')
            ])),
            G.field('operator'),
            G.field('value_string'),
            G.field('value_number'),
            G.field('value_timestamp'),
            G.field('value_set'),
        ])),
    ])),
]);
