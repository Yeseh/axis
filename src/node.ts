export class StructureNode<T> {
    _data: T | T[];
    _next_pointer: StructureNode<T>;
    _prev_pointer: StructureNode<T>;

    constructor(data: T | T[], prev: StructureNode<T>, next: StructureNode<T>) {
        this._data = data;
        this._next_pointer = next;
        this._prev_pointer = prev;
    }

    get data(): T | T[] {
        return this.data;
    }
    set data(value: T | T[]) {
        this._data = value;
    }
    get next(): StructureNode<T> {
        return this._next_pointer;
    }
    set next(value: StructureNode<T>) {
        this._next_pointer = value;
    }
    get prev(): StructureNode<T> {
        return this._prev_pointer;
    }
    set prev(value: StructureNode<T>) {
        this._prev_pointer = value;
    }
}

export default StructureNode;
