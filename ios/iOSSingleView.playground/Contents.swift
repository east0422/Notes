//: A UIKit based Playground for presenting user interface
  
import UIKit
import PlaygroundSupport

// 自定义视图
class CustomView1 : UIView {
    // 如果在UIView初始化时没有设置rect大小，将直接导致draw:不被自动调用。
    override func draw(_ rect: CGRect) {
        let inFrame = CGRect.init(x: 0, y: 0, width: 100, height: 100)
        let ctx = UIGraphicsGetCurrentContext()
        ctx?.setLineWidth(2);
        ctx?.setStrokeColor(UIColor.black.cgColor)
        ctx?.addEllipse(in: inFrame)
        ctx?.move(to: CGPoint.init(x: inFrame.midX, y: inFrame.minY))
        ctx?.addLine(to: CGPoint.init(x: inFrame.minX, y: inFrame.midY))
        ctx?.addLine(to: CGPoint.init(x: inFrame.maxX, y: inFrame.midY))
        ctx?.addLine(to: CGPoint.init(x: inFrame.midX, y: inFrame.minY))
        ctx?.strokePath()
    }
}

class MyViewController : UIViewController {
    override func loadView() {
        let view1: UIView = UIView.init(frame: CGRect.init(x: 0, y: 0, width: 320, height: 480))
        let view2 = UIView.init(frame: CGRect.init(x: 100, y: 100, width: 150, height: 200))
        let view3 = UIView.init(frame: CGRect.init(x: 0, y: 64, width: 320, height: 500))
        let toViewPoint = view1.convert(view2.frame.origin, to: view3) // (100.0, 36.0)
        let fromViewPoint = view1.convert(view2.frame.origin, from: view3) // (100.0, 164.0)
        
        print("toViewPoint:\(toViewPoint), fromViewPoint: \(fromViewPoint)")
        
        let view = UIView()
        view.backgroundColor = .red
//
//        let label = UILabel()
//        label.frame = CGRect(x: 150, y: 200, width: 200, height: 20)
//        label.text = "Hello World!"
//        label.textColor = .black
//
//        view.addSubview(label)
        self.view = view
        
        // customView1
        let cusView1 = CustomView1.init(frame: CGRect.init(x: 50, y: 50, width: 150, height: 150))
        cusView1.backgroundColor = UIColor.white
        view.addSubview(cusView1)
    }
}
// Present the view controller in the Live View window
PlaygroundPage.current.liveView = MyViewController()
