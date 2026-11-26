import SwiftUI

@main
struct TachiKidsApp: App {
    var body: some Scene {
        WindowGroup { ContentView().frame(minWidth: 780, minHeight: 680) }
    }
}

enum Mode: String, CaseIterable, Identifiable {
    case words = "Parole", syllables = "Sillabe", memory = "Memoria"
    var id: String { rawValue }
}

struct ContentView: View {
    @State private var playerName = ""
    @State private var mode: Mode = .words
    @State private var level = 1
    @State private var length = 2
    @State private var exposure = 600.0
    @State private var pause = 650.0
    @State private var fontSize = 86.0
    @State private var exposureText = "600"
    @State private var pauseText = "650"
    @State private var fontText = "86"
    @State private var count = 20
    @State private var current = ""
    @State private var visible = false
    @State private var running = false
    @State private var waiting = false
    @State private var completed = false
    @State private var answer: String?
    @State private var choices: [String] = []
    @State private var index = 0
    @State private var correct = 0
    @State private var task: Task<Void, Never>?
    @State private var wordQueue: [String] = []
    @State private var showCelebration = false
    @State private var confetti = false
    @State private var celebrationScale = 0.65
    @State private var history: [(Date, Int, Int)] = []

    private let banks: [[String]] = [
        ["APE","ALA","UVA","OCA","ORSO","SOLE","LUNA","MARE","PANE","MANO","NASO","CASA","MELA","RE","LUCE","NEVE","FIO","RENO","DADO","REMO","NAVE","PINO","ROSA","RANA","MURO","PESO","RISO","TUTA","DITO","BOCCA","PESCE","GATTO"],
        ["GATTO","CANE","FIORE","LIBRO","PALLA","LATTE","NONNO","MAMMA","SCUOLA","AMICO","VERDE","TRENO","PESCA","TIGRE","VOLPE","PRATO","PIETRA","NUVOLA","BOSCO","PONTE","FESTA","CARTA","PENNA","FARINA","CAVALLO","PULCINO","GIOCO","BAMBINO","GIARDINO","CILIEGIA","POMODORO","FARFALLA"],
        ["MATITA","FINESTRA","GELATO","BALENA","CASTELLO","FARFALLA","MONTAGNA","BICICLETTA","CONIGLIO","ELEFANTE","PIRATA","PAGLIACCIO","FORMICA","TARTARUGA","CARAMELLA","OMBRELLO","TELEFONO","QUADERNO","PANTALONI","PALLONCINO","CASCATA","COLLINA","SENTIERO","MERENDA","CANTANTE","PITTORE","CUCINA","OROLOGIO","CANGURO","DINOSAURO","GIRAFFA","COCCINELLA"],
        ["PRIMAVERA","CIOCCOLATO","TEMPORALE","BIBLIOTECA","MERAVIGLIA","PASSEGGIATA","ARCOBALENO","ASTRONAVE","AVVENTURA","COLLEZIONE","ESPERIMENTO","GIOCATTOLO","INVERNO","MATTINATA","POMERIGGIO","SOTTOMARINO","ACQUERELLO","CAMPANELLO","COSTRUZIONE","ESPLORATORE","FRAGOLA","GHIACCIO","IMPRONTA","LANTERNA","MACCHININA","PALLAVOLO","PENNARELLO","RAGNATELA","SCIVOLARE","TRAMPOLINO","ZAINETTO","ZUCCHERINO"],
        ["STRAORDINARIO","IMMAGINAZIONE","RESPONSABILITÀ","CONOSCENZA","INCREDIBILE","ESPLORATORE","OSSERVAZIONE","MERAVIGLIOSO","TRASFORMAZIONE","COLLABORAZIONE","COMUNICAZIONE","CURIOSITÀ","DELICATEZZA","DETERMINAZIONE","DIVERTIMENTO","ELETTRICITÀ","ENTUSIASMO","FANTASIOSO","GENEROSITÀ","ILLUMINAZIONE","INTELLIGENTE","LABORATORIO","MOVIMENTO","NATURALEZZA","OPPORTUNITÀ","PRECISIONE","PROGETTARE","RICCHEZZA","SENSIBILITÀ","SORPRENDENTE","UNIVERSO","VELOCEMENTE"],
        ["ACCOGLIENZA","AMBIENTAZIONE","ARCHITETTURA","ASTRONOMIA","ATMOSFERA","CARATTERISTICA","CIRCOLAZIONE","CIVILIZZAZIONE","COMPLICATO","CONSAPEVOLEZZA","CONTEMPORANEO","COSTELLAZIONE","CREATIVITÀ","DESTINAZIONE","ECOSISTEMA","EQUILIBRIO","EVOLUZIONE","FOTOGRAFIA","GEOGRAFIA","IDENTITÀ","INDIPENDENZA","INFORMAZIONE","INTERESSANTE","LABIRINTO","MATERIALE","MICROSCOPIO","MISTERIOSO","NECESSARIO","OSSIGENO","PAESAGGISTICO","PERCORSO","PERSONAGGIO"],
        ["ACQUEDOTTO","AMBIENTALISTA","ANTICHISSIMO","ARTICOLAZIONE","BIODIVERSITÀ","CATASTROFE","CIRCOSTANZA","COMPRENSIONE","CONSEGUENZA","COSTITUZIONE","DIFFERENZIARE","DIMOSTRAZIONE","DISPONIBILITÀ","DISTRIBUZIONE","EMERGENZA","ENCICLOPEDIA","FONDAMENTALE","FREQUENTEMENTE","FUNZIONAMENTO","GIURISPRUDENZA","IMPRESCINDIBILE","INASPETTATO","METEOROLOGIA","MOLTIPLICAZIONE","PARTECIPAZIONE","PREDISPOSIZIONE","RAGIONAMENTO","RICONOSCIMENTO","SODDISFAZIONE","SOSTENIBILITÀ","TEMPESTIVAMENTE","TRASVERSALE"],
        ["APPROFONDIMENTO","AUTENTICAZIONE","CARBONIZZAZIONE","CIRCOSCRIZIONE","CLASSIFICAZIONE","COORDINAMENTO","CRISTALLIZZAZIONE","DECENTRAMENTO","DETERMINAZIONE","DISPENSABILITÀ","ELETTRONICAMENTE","FOTOVOLTAICO","INTERDIPENDENZA","INTERPRETAZIONE","IRRAGGIUNGIBILE","MANIFESTAZIONE","METAMORFOSI","MULTIDISCIPLINARE","ORGANIZZAZIONE","PNEUMATICO","PRECAUZIONE","PROPORZIONALITÀ","RAPPRESENTAZIONE","RISTRUTTURAZIONE","SOVRAPPOSIZIONE","SPECIFICAZIONE","STRAORDINARIAMENTE","TELECOMUNICAZIONE","TRANQUILLAMENTE","VALUTAZIONE","VEROSIMIGLIANZA","VULCANOLOGIA"],
        ["INCOMPRENSIBILMENTE","INTERNAZIONALIZZAZIONE","CONTEMPORANEAMENTE","ELETTRODOMESTICO","FOTOSINTESI","INCONTROVERTIBILE","INFRANGIBILITÀ","INTERDISCIPLINARE","IRRESPONSABILITÀ","METEOROLOGICO","NEUROSCIENZIATO","PREDISPOSIZIONE","PRESTIGIATORE","PROBABILISTICAMENTE","PSICOLOGIA","QUINTESSENZA","RICONTESTUALIZZARE","SOVRANAZIONALE","TRANSCONTINENTALE","TRASFORMAZIONE","ULTRAFILTRAZIONE","UNIVERSALMENTE","VALORIZZAZIONE","VENTRILOQUO","VULNERABILITÀ","ZOOLOGICAMENTE","ANTICONSTITUZIONALE","DETERMINISTICAMENTE","INCOMMENSURABILE","INCONTROLLABILITÀ","MULTICULTURALISMO","SOVRADIMENSIONATO"],
        ["ANTICONSTITUZIONALMENTE","ELETTROENCEFALOGRAMMA","INCOMPRENSIBILITÀ","INTERDISCIPLINARIETÀ","OTORINOLARINGOIATRA","RAPPRESENTATIVITÀ","RESPONSABILIZZAZIONE","SOVRADIMENSIONAMENTO","TRASFORMAZIONALMENTE","CONTROINTERROGATORIO","DEPERSONALIZZAZIONE","INTERNETWORKING","IRRICONOSCIBILITÀ","MULTIDIMENSIONALITÀ","PALEONTOLOGICO","PSICOLINGUISTICA","QUANTIFICAZIONE","RIORGANIZZAZIONE","SISTEMATIZZAZIONE","TELECOMUNICAZIONI","TRASCRIZIONE","ULTRACENTRIFUGAZIONE","VERIFICABILITÀ","BIOCOMPATIBILITÀ","CARATTERIZZAZIONE","CIRCOSTANZIATAMENTE","INDETERMINATEZZA","INTERCONNESSIONE","NEUROPLASTICITÀ","SOVRAPPRODUZIONE","TRANSCODIFICAZIONE","AUTOREGOLAMENTAZIONE"]
    ]

    private let syllables: [Int: [String]] = [
        2:["MA","SO","LE","PA","TO","MI","LU","RE","CA","NO","BA","SI","FA","DO","TE","NI","PO","RA"],
        3:["TRA","SCA","GLO","PRE","CHI","GNE","FRA","SPE","CRI","DRO","GHI","ZZA","GLI","STR","SCI","CHE","GNA","TRO"],
        4:["STRA","GLIA","SCHE","CREI","TRAI","SQUI","GNEI","CHIO","SCIA","GLIO","GNOI","TRIE","CHIE","SCAI"],
        5:["SCHIA","STRIA","SCIAL","SQUAR","SCHIE","GLION","STRON","GHIAC","SCUOL","TRIAN"]
    ]

    var body: some View {
        ZStack {
            LinearGradient(colors:[Color(red:0.91,green:0.95,blue:1),Color(red:1,green:0.96,blue:0.89)],startPoint:.topLeading,endPoint:.bottomTrailing).ignoresSafeArea()
            VStack(spacing:18) {
                header
                if playerName.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty {
                    welcome
                } else if running || completed {
                    training
                } else {
                    settings
                }
                Text("Allenarsi è un'avventura: ogni tentativo ti rende più forte!").font(.caption).foregroundStyle(.secondary)
            }.padding(26)
            if showCelebration { celebrationOverlay }
        }
        .preferredColorScheme(.light)
        .onDisappear { task?.cancel() }
        .onChange(of: exposure) { value in exposureText = String(Int(value)) }
        .onChange(of: pause) { value in pauseText = String(Int(value)) }
        .onChange(of: fontSize) { value in fontText = String(Int(value)) }
    }

    private var header: some View {
        HStack {
            VStack(alignment:.leading,spacing:3) {
                Text("TachiKids").font(.system(size:32,weight:.bold,design:.rounded)).foregroundStyle(Color(red:0.16,green:0.22,blue:0.39))
                Text("Occhi pronti? Si gioca con le parole!").font(.subheadline).foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName:"eye.circle.fill").font(.system(size:48)).symbolRenderingMode(.palette).foregroundStyle(.white,.blue)
        }
    }

    private var welcome: some View {
        VStack(spacing:18) {
            Text("Ciao! 👋").font(.system(size:34,weight:.heavy,design:.rounded))
            Text("Come ti chiami?").font(.title2.bold())
            TextField("Scrivi qui il tuo nome",text:$playerName).textFieldStyle(.roundedBorder).font(.title3).frame(maxWidth:360)
                .multilineTextAlignment(.center)
            Text("Preparati a una super avventura di parole, sillabe e memoria!").multilineTextAlignment(.center).foregroundStyle(.secondary)
            Button { playerName = playerName.trimmingCharacters(in:.whitespacesAndNewlines) } label: {
                Label("Andiamo!",systemImage:"sparkles").frame(maxWidth:.infinity)
            }.buttonStyle(.borderedProminent).controlSize(.large).frame(maxWidth:320).disabled(playerName.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty)
        }.padding(34).frame(maxWidth:.infinity,minHeight:390).background(.white.opacity(0.94)).clipShape(RoundedRectangle(cornerRadius:24))
    }

    private var settings: some View {
        VStack(alignment:.leading,spacing:13) {
            HStack {
                Text("Pronti, \(playerName)!").font(.title2.bold())
                Spacer()
                Button("Cambia nome") { playerName = "" }.buttonStyle(.borderless)
            }
            Picker("Modalità",selection:$mode) { ForEach(Mode.allCases) { Text($0.rawValue).tag($0) } }.pickerStyle(.segmented)
            if mode == .syllables {
                HStack { Text("Lunghezza sillaba"); Spacer(); Picker("Lunghezza",selection:$length) { ForEach(2...5,id:\.self) { Text("\($0) lettere").tag($0) } }.frame(width:150) }
            } else {
                HStack { Text("Difficoltà"); Spacer(); Picker("Livello",selection:$level) { ForEach(1...10,id:\.self) { Text("Livello \($0)").tag($0) } }.frame(width:150) }
                Text(levelDescription).font(.caption).foregroundStyle(.secondary)
            }
            HStack(spacing:14) {
                numericSetting("Esposizione (ms)",text:$exposureText,range:50...5000,apply:{ exposure = min(5000,max(50,Double(exposureText) ?? 600)) })
                numericSetting("Pausa (ms)",text:$pauseText,range:0...5000,apply:{ pause = min(5000,max(0,Double(pauseText) ?? 650)) })
                numericSetting("Carattere (pt)",text:$fontText,range:36...140,apply:{ fontSize = min(140,max(36,Double(fontText) ?? 86)) })
            }
            HStack { Text("Numero stimoli"); Spacer(); Picker("Stimoli",selection:$count) { Text("10").tag(10); Text("20").tag(20); Text("30").tag(30); Text("50").tag(50); Text("Illimitati").tag(0) }.frame(width:150) }
            Button { start() } label: { Label("Inizia allenamento",systemImage:"play.fill").frame(maxWidth:.infinity) }.buttonStyle(.borderedProminent).controlSize(.large)
            if !history.isEmpty { Text("Ultima sessione: \(history[0].2) stimoli · \(history[0].1) risposte corrette").font(.caption).foregroundStyle(.secondary) }
        }.padding(22).background(.white.opacity(0.95)).clipShape(RoundedRectangle(cornerRadius:22)).shadow(color:.black.opacity(0.06),radius:16,y:6)
    }

    private var levelDescription: String {
        switch level {
        case 1: return "Parole brevi e familiari"
        case 2: return "Parole quotidiane"
        case 3: return "Parole più lunghe"
        case 4: return "Parole articolate"
        case 5: return "Parole ricche di sillabe"
        case 6: return "Parole con gruppi consonantici"
        case 7: return "Parole impegnative"
        case 8: return "Parole molto complesse"
        case 9: return "Parole da veri esploratori"
        default: return "Sfida esperta: parole lunghissime!"
        }
    }

    private func numericSetting(_ title:String,text:Binding<String>,range:ClosedRange<Int>,apply:@escaping()->Void)->some View {
        VStack(alignment:.leading,spacing:5) {
            Text(title).font(.caption).foregroundStyle(.secondary)
            HStack(spacing:4) {
                TextField("0",text:text).textFieldStyle(.roundedBorder).frame(minWidth:54)
                    .onSubmit(apply)
                Button("OK",action:apply).buttonStyle(.bordered).controlSize(.small)
            }
        }.frame(maxWidth:.infinity,alignment:.leading)
    }

    private var training: some View {
        VStack(spacing:18) {
            HStack {
                Text("\(playerName), stimolo \(index)"+(count > 0 ? " / \(count)" : "")).font(.headline)
                Spacer()
                Button("Termina") { finishSession() }.buttonStyle(.bordered)
            }
            if count > 0 { ProgressView(value:min(1,Double(index)/Double(count))) }
            Spacer(minLength:8)
            if completed {
                VStack(spacing:14) {
                    Text("🏆").font(.system(size:62))
                    Text("BRAVA/O, \(playerName.uppercased())!!").font(.system(size:34,weight:.black,design:.rounded)).multilineTextAlignment(.center).foregroundStyle(.orange)
                    Text("Hai completato la tua missione!").font(.title3.bold())
                    if mode == .memory {
                        Text("Risposte corrette: \(correct) su \(index)").font(.title2).foregroundStyle(.secondary)
                    } else {
                        Text("\(index) stimoli affrontati con coraggio!").font(.title2).foregroundStyle(.secondary)
                    }
                    Text(["Sei una forza! 🌟","Fantastico lavoro! 🚀","Ogni parola è una conquista! 🦄","Applausi per te! 👏"].randomElement() ?? "Sei una forza!").font(.headline)
                    Button { showCelebration = false; completed = false; running = false } label: {
                        Label("Ancora una partita!",systemImage:"arrow.clockwise").frame(maxWidth:.infinity)
                    }.buttonStyle(.borderedProminent).controlSize(.large).frame(maxWidth:320)
                }.frame(maxWidth:.infinity,minHeight:300)
            } else if visible {
                Text(current).font(.system(size:fontSize,weight:.bold,design:.rounded)).foregroundStyle(Color(red:0.15,green:0.22,blue:0.4)).minimumScaleFactor(0.4).lineLimit(1).frame(maxWidth:.infinity,minHeight:190)
            } else if mode == .memory && waiting {
                Text("Quale parola hai visto?").font(.title2.bold())
                LazyVGrid(columns:[GridItem(.flexible()),GridItem(.flexible())],spacing:12) {
                    ForEach(choices,id:\.self) { choice in
                        Button(choice) { choose(choice) }.buttonStyle(.borderedProminent).tint(answer == nil ? .blue : (choice == current ? .green : .gray)).disabled(answer != nil)
                    }
                }
                if let answer { Text(answer == current ? "Esatto! ⭐" : "Quasi! La parola era \(current)").font(.headline) }
                if answer != nil { Button("Continua") { next() }.buttonStyle(.borderedProminent) }
            } else {
                Text("Preparati…").foregroundStyle(.secondary).font(.title2)
            }
            Spacer(minLength:8)
        }.padding(24).frame(maxWidth:.infinity,minHeight:390).background(.white.opacity(0.95)).clipShape(RoundedRectangle(cornerRadius:22))
    }

    private var celebrationOverlay: some View {
        ZStack {
            Color.black.opacity(0.18).ignoresSafeArea()
            ForEach(0..<34,id:\.self) { i in
                Text(["🎉","⭐","✨","🎈","🦄","💖"].randomElement() ?? "⭐")
                    .font(.system(size:CGFloat(14 + (i % 5) * 5)))
                    .offset(x:confetti ? CGFloat((i * 37) % 620 - 310) : 0,y:confetti ? CGFloat((i * 53) % 520 - 260) : -40)
                    .opacity(confetti ? 1 : 0)
                    .animation(.easeOut(duration:1.8).delay(Double(i % 9) * 0.04),value:confetti)
            }
            VStack(spacing:12) {
                Text("🎊").font(.system(size:70))
                Text("EVVIVAAA!").font(.system(size:38,weight:.black,design:.rounded)).foregroundStyle(.orange)
                Text("BRAVA/O, \(playerName.uppercased())!!").font(.system(size:28,weight:.heavy,design:.rounded)).multilineTextAlignment(.center)
            }.padding(34).background(.regularMaterial).clipShape(RoundedRectangle(cornerRadius:28)).scaleEffect(celebrationScale)
                .animation(.spring(response:0.5,dampingFraction:0.55),value:celebrationScale)
        }.onAppear { confetti = true; celebrationScale = 1 }
    }

    private func start() {
        task?.cancel()
        exposure = min(5000,max(50,Double(exposureText) ?? exposure))
        pause = min(5000,max(0,Double(pauseText) ?? pause))
        fontSize = min(140,max(36,Double(fontText) ?? fontSize))
        index = 0; correct = 0; completed = false; running = true; waiting = false; answer = nil
        wordQueue = (mode == .syllables ? (syllables[length] ?? syllables[2]!) : banks[level-1]).shuffled()
        next()
    }

    private func next() {
        guard running else { return }
        if count > 0 && index >= count {
            running = false; completed = true
            history.insert((Date(),correct,index),at:0)
            withAnimation { showCelebration = true }
            return
        }
        index += 1; answer = nil; waiting = false
        let bank = mode == .syllables ? (syllables[length] ?? syllables[2]!) : banks[level-1]
        if wordQueue.isEmpty { wordQueue = bank.shuffled() }
        current = wordQueue.removeFirst()
        let distractors = bank.filter { $0 != current }.shuffled().prefix(3)
        choices = ([current] + distractors).shuffled()
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
        guard answer == nil else { return }
        answer = value
        if value == current { correct += 1 }
    }

    private func finishSession() {
        task?.cancel()
        running = false; visible = false; waiting = false; completed = true
        history.insert((Date(),correct,index),at:0)
        showCelebration = true
    }
}
