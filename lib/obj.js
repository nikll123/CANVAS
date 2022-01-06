// throw new Error("Can't instantiate abstract class!"); - just to remember


// abstract classes
class Obj {
    constructor(id) {
        this.id = id;
    }
}

class ObjGraf extends Obj {
    constructor(id, x, y) {
        super(id);
        this.x = x;
        this.y = y;
        this.state = STATE.NORMAL;
    }
}

