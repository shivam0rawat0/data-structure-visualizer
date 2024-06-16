class minHeap {
	constructor(order) {
		this.heap = [];
	}

	empty(){
		return this.heap.length==0;
	}

	left(index) {
		return (2 * index) + 1;
	}

	right(index) {
		return (2 * index) + 2;
	}

	parent(index) {
		return Math.floor((index - 1) / 2);
	}

	swap(i, j) {
		var t = this.heap[i];
		this.heap[i] = this.heap[j];
		this.heap[j] = t;
	}

	insert(node) {
		this.heap.push(node);
		this.moveUp();
	}

	peek() {
		if (this.heap.length == 0)
			return null;
		return this.heap[0];
	}

	remove() {
		if (this.heap.length == 0)
			return null;
		var node = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.moveDown();
		return node;
	}

	moveUp() {
		var index = this.heap.length - 1;
		var parentIndex = null;
		while ((parentIndex = this.parent(index)) >= 0){
			if(this.heap[parentIndex][1] > this.heap[index][1]) {
				this.swap(parentIndex, index);
				index = parentIndex;
			} else {
				break;
			}
		}
	}

	moveDown() {
		var index = 0;
		var leftIndex = null;
		while ((leftIndex = this.left(index)) < this.heap.length) {
			var rightIndex = this.right(index);
			if (rightIndex < this.heap.length &&
				this.heap[rightIndex][1] < this.heap[leftIndex][1]) {
				leftIndex = rightIndex;
			}
			if (this.heap[index][1] < this.heap[leftIndex][1]){
				break;
			} else {
				this.swap(index, leftIndex);
			}
			index = leftIndex;
		}
	}
}