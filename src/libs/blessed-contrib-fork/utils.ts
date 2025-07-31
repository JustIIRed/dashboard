import x256 from "x256";

/*
 * Recursively merge properties of two objects
 */
export function MergeRecursive(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): Record<string, any> {
  if (obj1 == null) {
    return obj2;
  }
  if (obj2 == null) {
    return obj1;
  }

  for (const p in obj2) {
    try {
      // property in destination object set; update its value
      if (obj2[p] && obj2[p].constructor == Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p]; // assign as any
      }
    } catch (e) {
      // property in destination object not set; create it and set its value
      obj1[p] = obj2[p];
    }
  }

  return obj1;
}

export function getTypeName(thing: any): string {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}

export function abbreviateNumber(value: number): string | number {
  let newValue: string | number = value;
  if (value >= 1000) {
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = "";
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      ).toString();
      const dotLessShortValue = (shortValue + "").replace(
        /[^a-zA-Z 0-9]+/g,
        ""
      );
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

export function getColorCode(
  color: string | number[] | number
): string | number {
  if (Array.isArray(color) && color.length == 3) {
    return x256(color[0], color[1], color[2]);
  } else if (typeof color === "string" || typeof color === "number") {
    return color;
  } else {
    // fallback for unexpected input
    return "";
  }
}
