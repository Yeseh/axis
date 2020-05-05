import Node from './node';
import {LinkedListBase} from './LinkedListBase';

export class DoublyLinkedList<T> extends LinkedListBase<T> {
    constructor(max_size: number) {
        super(max_size);
    }
    /**
     * Add an element to the start of the linked list, O(1)
     */
    public addFirst(elem: T | T[]) {
        if (this.isEmpty()) this.head = this.tail = new Node(elem, null, null);
        else {
            this.head.prev = new Node<T>(elem, null, this.head);
            this.head = this.head.prev;
        }
        this.size++;
    }
}
