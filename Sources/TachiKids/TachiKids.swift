import SwiftUI

@main
struct TachiKidsApp: App {
    var body: some Scene {
        WindowGroup { ContentView().frame(minWidth: 760, minHeight: 620) }
    }
}

enum Mode: String, CaseIterable, Identifiable {
    case words = "Parole", syllables = "Sillabe", memory = "Memoria visiva"
    var id: String { rawValue }
}

struct ContentView: View {
    @State private var mode: Mode = .words
    @State private var level = 1
    @State private var length = 2
    @State private var exposure = 600.0
    @State private var pause = 650.0
    @State private var fontSize = 86.0
    @State private var count = 20
    @State private var current = ""
    @State private var visible = false
    @State private var running = false
    @State private var waiting = false
    @State private var answer: String?
    @State private var choices: [String] = []
    @State private var index = 0
    @State private var correct = 0
    @State private var task: Task<Void, Never>?
    @State private var history: [(Date, Int, Int)] = []

    private let banks: [[String]] = [
        ["APE","ALA","UVA","OCA","ORSO","SOLE","LUNA","MARE","PANE","MANO","NASO","CASA","MELA"],
        ["GATTO","CANE","FIORE","LIBRO","PALLA","LATTE","NONNO","MAMMA","SCUOLA","AMICO","VERDE","TRENO"],
        ["MATITA","FINESTRA","GELATO","BALENA","CASTELLO","FARFALLA","MONTAGNA","BICICLETTA","CONIGLIO"],
        ["PRIMAVERA","CIOCCOLATO","TEMPORALE","BIBLIOTECA","ELEFANTE","MERAVIGLIA","PASSEGGIATA"],
        ["STRAORDINARIO","IMMAGINAZIONE","RESPONSABILITÀ","CONOSCENZA","INCREDIBILE","ESPLORATORE"]
    ]
    private let syllables: [Int: [String]] = [
        2:["MA","SO","LE","PA","TO","MI","LU","RE","CA","NO","BA","SI","FA","DO"],
        3:["TRA","SCA","GLO","PRE","CHI","GNE","FRA","SPE","CRI","DRO","GHI","ZZA"],
        4:["STRA","GLIA","SCHE","CREI","TRAI","SQUI","GNEI","CHIO"],
        5:["SCHIA","STRIA","SCIAL","SQUAR","SCHIE","GLION"]
    ]

    var body: some View {
        ZStack {
            LinearGradient(colors:[Color(red:0.93,green:0.96,blue:1),Color(red:1,green:0.96,blue:0.91)],startPoint:.topLeading,endPoint:.bottomTrailing).ignoresSafeArea()
            VStack(spacing:18) {
                HStack {
                    VStack(alignment:.leading,spacing:3) {
                        Text("TachiKids").font(.system(size:32,weight:.bold,design:.rounded)).foregroundStyle(Color(red:0.16,green:0.22,blue:0.39))
                        Text("Allenare gli occhi, le parole e la memoria").font(.subheadline).foregroundStyle(.secondary)
                    }
                    Spacer()
                    Image(systemName:"eye.circle.fill").font(.system(size:44)).foregroundStyle(.blue)
                }
                if running { training } else { settings }
                Text("Pochi minuti alla volta, senza fretta: l'obiettivo è allenarsi divertendosi.").font(.caption).foregroundStyle(.secondary)
            }.padding(26)
        }.preferredColorScheme(.light).onDisappear { task?.cancel() }
    }

    private var settings: some View {
        VStack(alignment:.leading,spacing:15) {
            Text("Prepara l'allenamento").font(.title2.bold())
            Picker("Modalità",selection:$mode) { ForEach(Mode.allCases) { Text($0.rawValue).tag($0) } }.pickerStyle(.segmented)
            if mode == .syllables {
                HStack { Text("Lunghezza sillaba"); Spacer(); Picker("Lunghezza",selection:$length) { ForEach(2...5,id:\.self) { Text("\($0) lettere").tag($0) } }.frame(width:140) }
            } else {
                HStack { Text("Difficoltà"); Spacer(); Picker("Livello",selection:$level) { ForEach(1...5,id:\.self) { Text("Livello \($0)").tag($0) } }.frame(width:140) }
            }
            settingSlider("Tempo di esposizione",value:$exposure,range:50...2000,unit:"ms")
            settingSlider("Pausa tra gli stimoli",value:$pause,range:0...3000,unit:"ms")
            settingSlider("Dimensione carattere",value:$fontSize,range:44...130,unit:"pt")
            HStack { Text("Numero stimoli"); Spacer(); Picker("Stimoli",selection:$count) { Text("10").tag(10); Text("20").tag(20); Text("50").tag(50); Text("Illimitati").tag(0) }.frame(width:140) }
            Button { start() } label: { Label("Inizia allenamento",systemImage:"play.fill").frame(maxWidth:.infinity) }.buttonStyle(.borderedProminent).controlSize(.large)
            if !history.isEmpty { Text("Ultime sessioni: \(history.count) · Ultimo risultato: \(history[0].1)/\(history[0].2) corrette").font(.caption).foregroundStyle(.secondary) }
        }.padding(22).background(.white.opacity(0.94)).clipShape(RoundedRectangle(cornerRadius:22)).shadow(color:.black.opacity(0.06),radius:16,y:6)
    }

    private func settingSlider(_ title:String,value:Binding<Double>,range:ClosedRange<Double>,unit:String)->some View {
        VStack(alignment:.leading,spacing:5) {
            HStack { Text(title); Spacer(); Text("\(Int(value.wrappedValue)) \(unit)").foregroundStyle(.secondary).monospacedDigit() }
            Slider(value:value,in:range,step:10)
        }
    }

    private var training: some View {
        VStack(spacing:20) {
            HStack { Text("Stimolo \(index)"+(count > 0 ? " / \(count)" : "")); Spacer(); Button("Termina") { stop() }.buttonStyle(.bordered) }
            ProgressView(value:count == 0 ? 0 : min(1,Double(index)/Double(count)))
            Spacer(minLength:12)
            if visible {
                Text(current).font(.system(size:fontSize,weight:.bold,design:.rounded)).foregroundStyle(Color(red:0.15,green:0.22,blue:0.4)).frame(maxWidth:.infinity,minHeight:180)
            } else if mode == .memory && waiting {
                Text("Quale parola hai visto?").font(.title2.bold())
                LazyVGrid(columns:[GridItem(.flexible()),GridItem(.flexible())],spacing:12) {
                    ForEach(choices,id:\.self) { choice in
                        Button(choice) { choose(choice) }.buttonStyle(.borderedProminent).tint(answer == nil ? .blue : (choice == current ? .green : .gray)).disabled(answer != nil)
                    }
                }
                if let answer { Text(answer == current ? "Bravissima! ⭐" : "La parola era \(current)").font(.headline) }
                if answer != nil { Button("Continua") { next() }.buttonStyle(.borderedProminent) }
            } else if index >= count && count > 0 {
                Text("Allenamento completato!").font(.title.bold())
                Text("Stimoli completati: \(index) · Risposte corrette: \(correct)").foregroundStyle(.secondary)
                Button("Nuovo allenamento") { stop() }.buttonStyle(.borderedProminent)
            } else {
                Text("Preparati…").foregroundStyle(.secondary)
            }
            Spacer(minLength:12)
        }.padding(24).frame(maxWidth:.infinity,minHeight:380).background(.white.opacity(0.94)).clipShape(RoundedRectangle(cornerRadius:22))
    }

    private func start() {
        task?.cancel(); index = 0; correct = 0; running = true; waiting = false; answer = nil
        next()
    }
    private func next() {
        guard running else { return }
        if count > 0 && index >= count { running = false; history.insert((Date(),correct,index),at:0); return }
        index += 1; answer = nil; waiting = false
        if mode == .syllables { current = (syllables[length] ?? syllables[2]!).randomElement()! }
        else { current = (banks[max(0,min(4,level-1))].shuffled().first ?? "CASA") }
        choices = Array(([current] + banks[max(0,min(4,level-1))].filter{$0 != current}.shuffled().prefix(3))).shuffled()
        visible = true
        task?.cancel()
        task = Task {
            try? await Task.sleep(nanoseconds:UInt64(exposure * 1_000_000))
            if Task.isCancelled { return }
            await MainActor.run {
                visible = false
                if mode == .memory { waiting = true }
                else { scheduleNext() }
            }
        }
    }
    private func scheduleNext() {
        task = Task {
            try? await Task.sleep(nanoseconds:UInt64(pause * 1_000_000))
            if Task.isCancelled { return }
            await MainActor.run { next() }
        }
    }
    private func choose(_ value:String) {
        guard answer == nil else { return }; answer = value
        if value == current { correct += 1 }
    }
    private func stop() { task?.cancel(); running = false; visible = false; waiting = false }
}
