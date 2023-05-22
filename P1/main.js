const smi = 15120.00;

let salarioBruto = parseFloat(prompt("Ingresa tu salario bruto anual (en €)"));
while (isNaN(salarioBruto) || salarioBruto < smi) {
  if (isNaN(salarioBruto)) {
    salarioBruto = parseFloat(prompt("Debes ingresar un número. Ingresa tu salario bruto anual (en €)"))
  }
  else {
    salarioBruto = parseFloat(prompt("Debes ingresar un salario bruto anual mayor al Salario Mínimo Interprofesional (15.120€)"));
  }
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

const BaseMinSS = 1759.50
const BaseMaxSS = 4495.50
let salarioBrutoMensual = salarioBruto / 12;

let baseSS = 0.00;
let pagoSS = 0.00;

salarioBrutoMensual < BaseMinSS ? baseSS = BaseMinSS : baseSS = Math.min(salarioBrutoMensual, BaseMaxSS);

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

function calcularIRPF(salarioBruto, tablaTramos) {
  let irpf = 0;
  let restante = salarioBruto - pagoSS;
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


const irpfPagar = calcularIRPF(salarioBruto, tramosEstatal) + calcularIRPF(salarioBruto, tramosMadrid);
const tasaEfectiva = irpfPagar/salarioBruto*100;

alert("Con un salario bruto de " + euroFormat(salarioBruto) + " anuales, en Madrid pagarías " + euroFormat(irpfPagar) + " en impuestos y " + euroFormat(pagoSS) + " a la Seguridad Social para el año fiscal 2023. La tasa efectiva de impuestos es de " + tasaEfectiva.toFixed(2) + "%");