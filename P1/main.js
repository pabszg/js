let sueldoBruto = parseFloat(prompt("Ingresa tu sueldo bruto anual (en €)"));

while (isNaN(sueldoBruto)) {
  sueldoBruto = parseFloat(prompt("Debes ingresar un número. Ingresa tu sueldo bruto anual (en €)"));
}

const tramosEstatal = [
  { limite: 0, tasa: 0 },
  { limite: 12450, tasa: 0.095 },
  { limite: 20200, tasa: 0.12 },
  { limite: 35200, tasa: 0.15 },
  { limite: 60000, tasa: 0.185 },
  { limite: 300000, tasa: 0.225 },
  { limite: Infinity, tasa: 0.245 }
];

const tramosMadrid = [
  { limite: 0, tasa: 0 },
  { limite: 12960.45, tasa: 0.085 },
  { limite: 18433.19, tasa: 0.107 },
  { limite: 34350.49, tasa: 0.128 },
  { limite: 55601.89, tasa: 0.174 },
  { limite: Infinity, tasa: 0.205 }
];

const BaseMinSS = 1759.5
const BaseMaxSS = 4495.5
let sueldoBrutoMensual = sueldoBruto / 12;

let baseSS = 0;
let pagoSS = 0;

sueldoBrutoMensual < BaseMinSS ? baseSS = BaseMinSS : baseSS = Math.min(sueldoBrutoMensual, BaseMaxSS);

pagoSS = baseSS * 0.0625 * 12

console.log(baseSS);
console.log(pagoSS);
console.log(BaseMinSS)
console.log(tramosEstatal)
console.log(tramosMadrid)

function euroFormat(number) {
  euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(number)
  return euro;
}

function calcularIRPF(sueldoBruto, tablaTramos) {
  let irpf = 0;
  let restante = sueldoBruto - pagoSS;
  const tramos = tablaTramos;
  for (let t = 1; t <= tramos.length; t++) {
    const rango = tramos[t].limite - tramos[t-1].limite;
    const cantidad = Math.min(rango, restante);
    irpf += cantidad * tramos[t].tasa;
    restante -= cantidad;
    if (restante <= 0) {
      break;
    }
  }
  console.log(irpf)
  return irpf;
}

const irpfPagar = calcularIRPF(sueldoBruto, tramosEstatal) + calcularIRPF(sueldoBruto, tramosMadrid);
const tasaEfectiva = irpfPagar/sueldoBruto*100;

alert("Con un sueldo bruto de " + euroFormat(sueldoBruto) + " anuales, en Madrid pagarías " + euroFormat(irpfPagar) + " en impuestos y " + euroFormat(pagoSS) + " a la Seguridad Social. La tasa efectiva es de " + tasaEfectiva.toFixed(2) + "%");