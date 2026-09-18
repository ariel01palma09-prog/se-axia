let puerto = null;
let escritor = null;
async function conectarBluetooth() {
    try {
        if (!("serial" in navigator)) {
            alert(
                "Tu navegador no permite Web Serial. " +
                "Usa Google Chrome o Microsoft Edge."
            );
            return;
        }
        puerto =
            await navigator.serial.requestPort();
        await puerto.open({
            baudRate: 9600
        });
        escritor =
            puerto.writable.getWriter();


        document
            .getElementById("estadoArduino")
            .innerHTML =
            " Bluetooth conectado";
        alert(
            "Bluetooth conectado correctamente."
        );
    }
    catch (error) {
        console.error(error);
        document
            .getElementById("estadoArduino")
            .innerHTML =
            " Bluetooth desconectado";
        alert(
            "No se pudo conectar al Bluetooth."
        );
    }
}
async function enviarLetra(letra) {
    document
        .getElementById("palabra")
        .value =
        letra;
    mostrarLetra(letra);
    document
        .getElementById("resultado")
        .innerHTML =
        "Letra enviada: <strong>" +
        letra +
        "</strong>";
    if (!escritor) {
        alert(
            "Primero conecta el Bluetooth."
        );
        return;
    }
    try {
        const datos =
            new TextEncoder().encode(
                letra + "\n"
            );
        await escritor.write(datos);
        document
            .getElementById("estadoArduino")
            .innerHTML =
            "Enviado al Arduino: " +
            letra;
        console.log(
            "Enviado:",
            letra
        );
    }
    catch (error) {
        console.error(error);
        document
            .getElementById("estadoArduino")
            .innerHTML =
            "Error al enviar";
    }
}
function traducir() {
    let palabra =
        document
        .getElementById("palabra")
        .value;
    palabra =
        palabra
        .toUpperCase()
        .trim();
    if (palabra === "") {
        document
            .getElementById("resultado")
            .innerHTML =
            "Por favor, escribe una palabra.";
        return;
    }
    let letras =
        palabra.split("");
    document
        .getElementById("resultado")
        .innerHTML =
        "Palabra: <strong>" +
        palabra +
        "</strong><br><br>" +
        "Letras: " +
        letras.join(" → ");
    let secuencia = "";
    for (
        let i = 0;
        i < letras.length;
        i++
    ) {
        secuencia +=
            "Seña " +
            (i + 1) +
            ": <strong>" +
            letras[i] +
            "</strong><br>";
    }
    document
        .getElementById("secuencia")
        .innerHTML =
        secuencia;
    mostrarLetra(letras[0]);
}
async function enviarPalabra() {
    let palabra =
        document
        .getElementById("palabra")
        .value;
    palabra =
        palabra
        .toUpperCase()
        .trim();
    if (palabra === "") {
        alert(
            "Escribe una palabra primero."
        );
        return;
    }
    if (!escritor) {
        alert(
            "Primero conecta el Bluetooth."
        );
        return;
    }
    let letras =
        palabra.split("");
    for (
        let i = 0;
        i < letras.length;
        i++
    ) {
        let letra =
            letras[i];
        mostrarLetra(letra);
        document
            .getElementById("secuencia")
            .innerHTML =
            "Enviando letra " +
            (i + 1) +
            " de " +
            letras.length +
            ": <strong>" +
            letra +
            "</strong>";
        const datos =
            new TextEncoder().encode(
                letra + "\n"
            );
        await escritor.write(datos);
        document
            .getElementById("estadoArduino")
            .innerHTML =
            " Enviado: " +
            letra;
        console.log(
            "Enviado al Arduino:",
            letra
        );
        await esperar(1500);
    }
    document
        .getElementById("estadoArduino")
        .innerHTML =
        "Palabra enviada: " +
        palabra;
}
function esperar(tiempo) {
    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                tiempo
            )
    );
}
function mostrarLetra(letra) {
    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        document
            .getElementById(
                "dedo" + i
            )
            .classList
            .remove("activo");
    }
    let movimientos = {
        A: [1, 1, 0, 0, 0],
        B: [0, 0, 0, 0, 1],
        C: [1, 0, 0, 0, 1],
        D: [0, 1, 1, 1, 1],
        E: [1, 1, 1, 1, 1],
        F: [0, 1, 1, 1, 0],
        G: [1, 0, 1, 1, 0],
        H: [1, 1, 0, 1, 0],
        I: [0, 0, 0, 0, 1],
        J: [0, 0, 0, 0, 1],
        K: [1, 1, 0, 1, 0],
        L: [1, 1, 1, 1, 0],
        M: [1, 1, 1, 1, 1],
        N: [1, 1, 1, 1, 1],
        O: [1, 1, 1, 1, 0],
        P: [1, 1, 0, 1, 0],
        Q: [1, 0, 1, 1, 0],
        R: [0, 1, 0, 1, 0],
        S: [1, 1, 1, 1, 1],
        T: [1, 1, 1, 1, 0],
        U: [0, 0, 1, 1, 0],
        V: [0, 0, 1, 1, 0],
        W: [0, 0, 0, 1, 0],
        X: [1, 0, 0, 0, 0],
        Y: [1, 0, 0, 0, 1],
        Z: [1, 0, 0, 0, 0]
    };
    let movimiento =
        movimientos[letra];
    if (!movimiento) {
        return;
    }

    for (
        let i = 0;
        i < 5;
        i++
    ) {
        if (
            movimiento[i] === 1
        ) {
            document
                .getElementById(
                    "dedo" + (i + 1)
                )
                .classList
                .add("activo");
        }
    }
}