import Foundation

// OC中前后都为11
let testBlock = {
    var outA = 8
    let myPtr = {(a: Int) -> Int in
        return outA + a
    }
//    let result = myPtr(3) // 11
    outA = 5
    let result = myPtr(3) // 8
    print(result)
}

testBlock()

NSNumber(value: true).intValue // 1
