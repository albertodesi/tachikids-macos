// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TachiKids",
    platforms: [.macOS(.v13)],
    products: [.executable(name: "TachiKids", targets: ["TachiKids"])],
    targets: [.executableTarget(name: "TachiKids", resources: [.process("Resources")])]
)
