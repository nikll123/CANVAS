// throw new Error("Can't instantiate abstract class!"); - just to remember


// abstract classes
class Obj {
    constructor(id) {
        this.id = id;
    }

    toString() {
        let retval = this.id;
        return retval;
    };

}

class ObjGraf extends Obj {
    constructor(id, x, y) {
        super(id);
        this.x = x;
        this.y = y;
        this.state = STATUS.NORMAL;
    }

    toString(fmt = FORMAT.LONG) {
        let retval = super.toString() + ':'
        if (this.x != undefined) {
            let t1 = '';
            if (fmt == FORMAT.LONG)
                t1 = 'x=';
            retval = retval + t1 + Calc.round(this.x) + ',';
        }
        if (this.y != undefined) {
            let t1 = '';
            if (fmt == FORMAT.LONG)
                t1 = 'y=';
            retval = retval + t1 + Calc.round(this.y);
        }
        return retval;
    };
}

