const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3003;

// Lista de empleados con CBUs
const empleados = [
  { 
    nombre: "Agente Fede", 
    cbus: [
      { servicio: "Mercado Pago", titular: "pedrito", cbu: "0000003100027950919682", ultimaLlamada: null },
      { servicio: "Naranja X", titular: "pedrito", cbu: "4530000800014342514619", ultimaLlamada: null },
      { servicio: "Personal Pay", titular: "pedrito", cbu: "0000076500000039051909", ultimaLlamada: null },
    ], 
    indice: 0 
  },
  { 
    nombre: "Agente Diego", 
    cbus: [
      { servicio: "Belo", titular: "pedrito", cbu: "0000139300000014401000", ultimaLlamada: null },
      { servicio: "Personal Pay", titular: "pedrito", cbu: "0000076500000039044136", ultimaLlamada: null },
    ], 
    indice: 0 
  },
  { 
    nombre: "Agente Lautaro", 
    cbus: [
      { servicio: "MercadoPago", titular: "pedrito", cbu: "0000003100065498736644", ultimaLlamada: null },
      { servicio: "Personal Pay", titular: "pedrito", cbu: "0000076500000039065650", ultimaLlamada: null },
      { servicio: "Dolar App", titular: "pedrito", cbu: "0000069707628893619377", ultimaLlamada: null },
    ], 
    indice: 0 
  },
];

// Función para obtener el próximo CBU de un empleado
function obtenerCBU(empleadoIndex) {
  if (empleadoIndex < 0 || empleadoIndex >= empleados.length) {
    return { error: "Empleado no encontrado" };
  }

  const empleado = empleados[empleadoIndex];
  const cuenta = empleado.cbus[empleado.indice];

  // Registrar la fecha y hora de la última llamada
  cuenta.ultimaLlamada = new Date().toLocaleString();

  // Mover al siguiente CBU dentro del mismo agente
  empleado.indice = (empleado.indice + 1) % empleado.cbus.length;

  return {
    empleado: empleado.nombre,
    servicio: cuenta.servicio,
    cbu: cuenta.cbu,
    titular: cuenta.titular,
    ultimaLlamada: cuenta.ultimaLlamada
  };
}
app.use(express.json()); // Middleware para leer JSON en el body

app.post("/agregar-cuenta", (req, res) => {
  const { empleado, cuenta } = req.body;

  // Validar si el índice es correcto
  if (isNaN(empleado) || empleado < 1 || empleado > empleados.length) {
    return res.status(400).json({ error: "Índice de empleado inválido" });
  }

  // Agregar la nueva cuenta al empleado correspondiente
  empleados[empleado - 1].cbus.push({
    ...cuenta,
    ultimaLlamada: null, // Aseguramos que empiece sin fecha de llamada
  });

  res.json({ message: "Cuenta añadida correctamente", empleado: empleados[empleado - 1] });
});


// Endpoint para obtener el CBU según el agente
app.get("/obtener-cbu", (req, res) => {
  const empleadoIndex = parseInt(req.query.empleado);
  
  // Validar si el índice es correcto
  if (isNaN(empleadoIndex) || empleadoIndex < 1 || empleadoIndex > empleados.length) {
    return res.status(400).json({ error: "Índice de empleado inválido" });
  }

  res.json(obtenerCBU(empleadoIndex - 1));
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
