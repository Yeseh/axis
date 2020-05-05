import Node from './node';
export abstract class LinkedListBase<T> {
    private _size: number = 0;
    private _head: Node<T> = null;
    private _tail: Node<T> = null;
    public max_size: number;

    constructor(max_size: number) {
        this.max_size = max_size;
    }
    get size(): number {
        return this._size;
    }
    set size(value: number) {
        this._size = value;
    }
    get head(): Node<T> {
        return this._head;
    }
    set head(value: Node<T>) {
        this._head = value;
    }
    get tail(): Node<T> {
        return this._tail;
    }
    set tail(value: Node<T>) {
        this._tail = value;
    }

    /**
     * Empties this linked list, O(n)
     */
    public clear(): void {
        let trav: Node<T> = this.head;
        while (trav != null) {
            let next: Node<T> = trav.next;
            trav.prev = trav.next = null;
            trav.data = null;
            trav = next;
        }
        this.head = this.tail = trav = null;
        this.size = 0;
    }
    public isEmpty(): boolean {
        return this.size === 0;
    }
    /**
     * Add an element to the tail of the linked list, O(1)
     */
    public add(elem: T | T[]): void {
        this.addLast(elem);
    }
    /**
     * Add an element to the tail of the linked list, O(1)
     */
    public addLast(elem: T | T[]) {
        if (this.isEmpty()) this.head = this.tail = new Node(elem, null, null);
        else {
            this.tail.next = new Node<T>(elem, this.tail, null);
            this.tail = this.tail.next;
        }
        this.size++;
    }
    /**
     * Return the data stored in the head node, O(1)
     */
    public peekFirst(): T | T[] {
        if (this.isEmpty()) throw new TypeError('List is empty');
        return this.head.data;
    }
    /**
     * Return the data stored in the tail node, O(1)
     */
    public peekLast(): T | T[] {
        if (this.isEmpty()) throw new Error('List is empty');
        return this.tail.data;
    }
    public removeFirst() {
        if (this.isEmpty()) throw new Error('List is empty');
        let data = this.head.data;
        this.head = this.head.next;
        this.size--;

        // If the list is now empty, remove tail
        if (this.isEmpty()) this.tail = null;
        // Else deallocate reference to removed node
        else this.head.prev = null;

        return data;
    }

    public removeLast() {
        if (this.isEmpty()) throw new Error('List is empty');
        let data = this.tail.data;
        this.tail = this.tail.prev;
        this.size--;
        // If the list is now empty, remove tail
        if (this.isEmpty()) this.head = null;
        // Else deallocate reference to removed node
        else this.tail.next = null;
        return data;
    }
    /**
     * Remove a node from the list, O(1)
     */
    private removeNode(node: Node<T>): T | T[] {
        if (this.isEmpty()) throw new Error('List is empty');

        if (node.prev === null) return this.removeFirst();
        if (node.next === null) return this.removeLast();

        node.next.prev = node.prev;
        node.prev.next = node.next;

        const data = node.data;

        node.data = null;
        node = node.prev = node.next = null;

        this.size--;

        return data;
    }

    /**
     * Remove a node at a specific index, O(n)
     */
    public removeAt(index: number) {
        if (index < 0 || index >= this.size)
            throw new Error('Index out of bounds');

        let i: number;
        let trav: Node<T>;

        if (index < this.size / 2) {
            for (i = 0, trav = this.head; i !== index; i++) trav = trav.next;
        } else {
            for (i = this.size - 1, trav = this.tail; i !== index; i--)
                trav = trav.prev;
        }

        return this.removeNode(trav);
    }
    /**
     * Lookup and remove a node by its data, O(n)
     */
    public remove(value: any): boolean {
        let trav: Node<T> = this.head;

        if (value == null) {
            for (trav = this.head; trav !== null; trav = trav.next) {
                if (trav.data == null) {
                    this.removeNode(trav);
                    return true;
                }
            }
        } else {
            for (trav = this.head; trav !== null; trav = trav.next) {
                if (trav.data === value) {
                    this.removeNode(trav);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Find the index of a particular value in the list, O(n)
     */
    public indexOf(value: any) {
        let index = 0;
        let trav: Node<T> = this.head;

        if (value == null) {
            for (trav = this.head; trav !== null; trav = trav.next) {
                if (trav.data == null) {
                    return index;
                }
            }
        } else {
            for (trav = this.head; trav !== null; trav = trav.next) {
                if (trav.data === value) {
                    return index;
                }
            }
        }
        return -1;
    }
    /**
     * Check if the list contains a certain value, O(n)
     */
    public contains(value: any) {
        return this.indexOf(value) !== -1;
    }
}
