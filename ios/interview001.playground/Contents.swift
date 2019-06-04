import Cocoa

var title = "interview001"

// 高阶函数map用法
let strArr = ["Objective-C", "Swift", "Java", "C", "C++"]
func count(str: String) -> Int {
    return str.count
}
print(strArr.map(count))
print(strArr.map({ (str) -> Int in
    return str.count
}))
print(strArr.map({
    return $0.count
}))

