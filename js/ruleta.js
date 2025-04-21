
        const canvas = document.getElementById("ruleta");
        const ctx = canvas.getContext("2d");
        const girarBtn = document.getElementById("girarBtn");
        canvas.width = 480;
        canvas.height = 480;
        // se utiliza \u2006\u2006 para hacer espacios entre las letras
        const premios = [
            { nombre: "Segui participando" }, // índice 0  segui participando
            { nombre: "Te Pasaste" },            // índice 1 
            { nombre: "Regalo Sorpresa" },            // índice 2
            { nombre: "Casi\u2006\u2006Casi" },        // índice 3  cuarto continente
            { nombre: "Una\u2006\u2006Vuelta Mas" },        // índice 4
            { nombre: "En\u2006\u2006La\u2006\u2006Pera Consumición S/C" },             // índice 5
            { nombre: "A\u2006\u2006Bailar\u2006\u2006All The\u2006\u2006Night " }         // índice 6
        ];
        const colores = ["#2C3E50", "#E74C3C", "#F39C12", "#0e1a49", "#1ABC9C", "#9B59B6", "#E91E63"];

       
        let animacionEnCurso = false;

        const numSectores = premios.length;
        const anguloSector = (2 * Math.PI) / numSectores;
        let anguloActual = 0;




        function dibujarRuleta() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numSectores; i++) {
                const anguloInicio = i * anguloSector;
                const anguloFin = (i + 1) * anguloSector;
        
                // Dibujar sector
                ctx.beginPath();
                ctx.moveTo(240, 240);
                ctx.arc(240, 240, 240, anguloInicio, anguloFin);
                ctx.fillStyle = colores[i % colores.length];
                ctx.fill();
                ctx.stroke();
        
                // Dibujar texto
                ctx.save();
                ctx.translate(240, 240);
                ctx.rotate(anguloInicio + anguloSector / 2);
                ctx.fillStyle = "white";
                ctx.font = "bold 18px Arial";
                ctx.textAlign = "center";
        
                const texto = premios[i].nombre;
                const lineas = texto.split(" "); // logica para el espaciado de linea en la ruleta 
        
                if (lineas.length === 1) {
                    ctx.fillText(lineas[0], 160, 10); // Solo una palabra
                } else if (lineas.length === 2) {
                    ctx.fillText(lineas[0], 160, 0);   // Primera línea
                    ctx.fillText(lineas[1], 160, 20);  // Segunda línea
                } else {
                    // Para 3 o más palabras, en 3 líneas
                    ctx.fillText(lineas[0], 160, -10);
                    ctx.fillText(lineas[1], 160, 10);
                    ctx.fillText(lineas.slice(2).join(" "), 160, 30);
                }
                
        
                ctx.restore();
            }
        }
        

        function girarRuleta() {
            if (animacionEnCurso) return;  // Previene que se ejecute varias veces
            animacionEnCurso = true;
            document.getElementById("audioGiro").play();

        
            girarBtn.disabled = true; // Deshabilitar el botón mientras gira
            
            const probabilidadSegui = 0.7; // 70% de probabilidad de "Seguí participando"
            const probabilidadCuartoContinente = 0.3; // 30% de probabilidad de "Cuarto Continente"
            const girosCompletos = 5; // Número de giros completos antes de detenerse
            const rotacionBase = 360 * girosCompletos; // Rotación base (múltiples giros completos)
        
            let anguloFinal;
            let numeroAleatorio = Math.random();
        
            if (numeroAleatorio < probabilidadSegui) {
                const indiceSeguiParticipando = 0; // "Seguí participando" es el primer sector
                const anguloSector = 360 / numSectores;
                const anguloCentroSegui = anguloSector * indiceSeguiParticipando + anguloSector / 2;
                anguloFinal = rotacionBase + (360 - anguloCentroSegui);
            } else {
                const indiceCuartoContinente = 3; // "Cuarto Continente" es el cuarto sector
                const anguloSector = 360 / numSectores;
                const anguloCentroCuarto = anguloSector * indiceCuartoContinente + anguloSector / 2;
                anguloFinal = rotacionBase + (360 - anguloCentroCuarto);
            }
        
            // Aplicamos la rotación
            anguloActual = anguloFinal;
            canvas.style.transition = "transform 3s ease-out";
            canvas.style.transform = `rotate(${anguloActual}deg)`;
        
            // Mostrar animación de los premios
            mostrarPremiosAnimados();
        
            setTimeout(() => {
                // Cálculo del premio final
                const anguloPremio = (360 - (anguloActual % 360)) % 360;
                const indicePremio = Math.floor(anguloPremio / (360 / numSectores));
                const premioGanador = premios[indicePremio].nombre;
        
                // Mostrar el premio final después de la animación
                document.getElementById("resultado").innerText = `¡ ${premioGanador} !`;
        
                // Reseteamos la transformación para permitir nuevos giros
                setTimeout(() => {
                    canvas.style.transition = "none";
                    canvas.style.transform = `rotate(${anguloActual % 360}deg)`;
                    girarBtn.disabled = false;
                    animacionEnCurso = false; // Vuelve a habilitar la animación
                    
                       // 👉 Acá podés agregar estas líneas para detener el audio
                    document.getElementById("audioGiro").pause();
                    document.getElementById("audioGiro").currentTime = 0;
                    
                    
                }, 100);
            }, 3000);
        }
        
        function mostrarPremiosAnimados() {
            const resultadoDiv = document.getElementById("resultado");
            let contador = 0;
            
            // Inicializamos la animación mostrando los premios rápidamente
            const intervalo = setInterval(() => {
                resultadoDiv.innerText = premios[contador % premios.length].nombre;
                contador++;
            }, 100);  // Cambiar el premio cada 100 ms (ajustar para velocidad)
        
            // Detener la animación después de unos segundos (cuando la ruleta termina de girar)
            setTimeout(() => {
                clearInterval(intervalo);
            }, 2500); // La animación dura 2.5 segundos
        }
        
        

        dibujarRuleta();

        window.addEventListener("load", () => {
            canvas.style.transition = "transform 0s";
            canvas.style.transform = "rotate(0.1deg)";
        });
