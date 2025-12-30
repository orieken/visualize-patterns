export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

export class LinkedList<T> {
  public head: ListNode<T> | null = null;

  add(val: T) {
    if (!this.head) {
      this.head = new ListNode(val);
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = new ListNode(val);
  }

  // TODO: implement getIterator()
}

/**
 * CHALLENGE: Implement ListIterator.
 */
export class ListIterator<T> {
  // TODO: Constructor
  
  hasNext(): boolean {
    return false; // <-- FIX THIS
  }

  next(): T | null {
    return null; // <-- FIX THIS
  }
}
