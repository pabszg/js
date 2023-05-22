// VARIABLES Y OBJETOS
const smi = 15120.00;
const baseMinSS = 1759.50
const baseMaxSS = 4495.50
let baseSS = 0.00;
let pagoSS = 0.00;
let salarioNetoMensual = 0.00;
let salarioExtra = 0.00;
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

// INPUTS Y CHECKEOS
let salarioBruto = parseFloat(prompt("Ingresa tu salario bruto anual (en €)"));
while (isNaN(salarioBruto) || salarioBruto < smi) {
  if (isNaN(salarioBruto)) {
    salarioBruto = parseFloat(prompt("Debes ingresar un número válido. Ingresa tu salario bruto anual (en €)"))
  }
  else {
    salarioBruto = parseFloat(prompt("Debes ingresar un salario bruto anual mayor al Salario Mínimo Interprofesional (15.120€)"));
  }
  }

let numeroPagas = parseFloat(prompt("Cuántos sueldos al año? (12 o 14)"))

while (numeroPagas != 12 && numeroPagas != 14) {
  numeroPagas = parseFloat(prompt("Cuántos sueldos al año? Debes ingresar 12 o 14"))
}

let salarioBrutoMensual = salarioBruto / 12;

// CALCULO SEGURIDAD SOCIAL
salarioBrutoMensual < baseMinSS ? baseSS = baseMinSS : baseSS = Math.min(salarioBrutoMensual, baseMaxSS);
pagoSS = baseSS * 0.0625 * 12;

// CALCULO IRPF POR TABLA
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
  return irpf;
}
// FORMATO A EUROS
let euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// CALCULOS
const pagoIRPF = calcularIRPF(salarioBruto, tramosEstatal) + calcularIRPF(salarioBruto, tramosMadrid);
const tasaEfectiva = pagoIRPF/salarioBruto*100;
const cargaTributaria = (pagoIRPF + pagoSS) / salarioBruto * 100;
const salarioNetoAnual = salarioBruto - (pagoIRPF + pagoSS)

switch(numeroPagas) {
  case(12):
    salarioNetoMensual = salarioNetoAnual / 12;
    console.log(salarioNetoMensual);
    break;
  case(14):
    salarioExtra = salarioNetoAnual / 14;
    salarioNetoMensual = salarioExtra - (pagoSS / 12);
    console.log(salarioNetoMensual);
    console.log(salarioExtra);
    break;
  default:
    break;
}

// OUTPUT
let mensaje = `Con un salario bruto de ${euro.format(salarioBruto)} anuales, en Madrid pagarías ${euro.format(pagoIRPF)} en impuestos \
 y ${euro.format(pagoSS)} a la Seguridad Social para el año fiscal 2023. 
 \n Tasa efectiva de impuestos: ${tasaEfectiva.toFixed(2)}%
 \n Carga Fiscal: ${cargaTributaria.toFixed(2)}%
 \n Salario neto mensual: ${euro.format(salarioNetoMensual)} `

 numeroPagas == 14 ? mensaje += `\n Pagas extra (x2): ${euro.format(salarioExtra)}` : "";

alert(mensaje);