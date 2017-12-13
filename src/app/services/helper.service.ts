export class HelperService {

    constructor() {}

    objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] && array[i][key] == value) {
                return array[i];
            }
        }
        return null;
    }

    // Two-dimensional vector constructor
    V2 = function(x,y) {
        return {x: x, y: y};
    };
}
