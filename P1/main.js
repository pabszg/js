// VARIABLES Y OBJETOS
const smi = 15120.00;
const baseMinSS = 1759.50
const baseMaxSS = 4495.50
let baseSS = 0.00;
let pagoSS = 0.00;
let salarioNetoMensual = 0.00;
let salarioExtra = 0.00;

let user = {
  name: "",
  age: "",
  salarioBruto: "",
  numeroPagas: ""
};

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

// FORMATO A EUROS
let euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// CALCULO IRPF POR TABLA (COMUNIDAD AUTÓNOMA Y ESTATAL)
const calcularIRPF = (salarioBruto, tablaTramos) => {
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
const output = () => {
  // CALCULOS
  baseSS = 0.00;
  pagoSS = 0.00;
  salarioNetoMensual = 0.00;
  ssalarioExtra = 0.00;
  const pagoIRPF = calcularIRPF(user.salarioBruto, tramosEstatal) + calcularIRPF(user.salarioBruto, tramosMadrid);
  const tasaEfectiva = pagoIRPF/user.salarioBruto*100;
  const cargaTributaria = (pagoIRPF + pagoSS) / user.salarioBruto * 100;
  const salarioNetoAnual = user.salarioBruto - (pagoIRPF + pagoSS);
  let salarioBrutoMensual = user.salarioBruto / 12;
  // CALCULO SEGURIDAD SOCIAL SOBRE SALARIO, ENTRE MÍNIMO Y MÁXIMO IMPONIBLE
  salarioBrutoMensual < baseMinSS ? baseSS = baseMinSS : baseSS = Math.min(salarioBrutoMensual, baseMaxSS);
  pagoSS = baseSS * 0.0625 * 12;
  switch(user.numeroPagas) {
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
  let mensaje = `${user.name},
  <br>Con un salario bruto de <strong>${euro.format(user.salarioBruto)}</strong> anuales, en Madrid pagarías <strong>${euro.format(pagoIRPF)}</strong> en impuestos\
  y <strong>${euro.format(pagoSS)}</strong> a la Seguridad Social para el año fiscal 2023. 
  <br><strong>Tasa efectiva de impuestos:</strong> ${tasaEfectiva.toFixed(2)}%
  <br><strong>Carga Fiscal:</strong> ${cargaTributaria.toFixed(2)}%
  <br><strong>Salario neto mensual:</strong> ${euro.format(salarioNetoMensual)} `
  user.numeroPagas == 14 ? mensaje += `
  <br><strong>Pagas extra (x2): ${euro.format(salarioExtra)}` : "";
  document.getElementById("results").innerHTML = mensaje;
}

let form = document.getElementById("calculadora")
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputs = e.target.children;
  user.name = inputs.name.value;
  user.age = parseInt(inputs.age.value);
  user.salarioBruto = parseFloat(inputs.gross.value);
  try {
    user.numeroPagas = parseInt(document.querySelector('input[name="sueldos"]:checked').value);
    isNaN(user.age) ? alert("Debes ingresar tu edad") : "" ;
    if (isNaN(user.salarioBruto) || user.salarioBruto < smi) {
    isNaN(user.salarioBruto) ? alert("Debes ingresar un número válido. Ingresa tu salario bruto anual (en €, sin puntos")
    : user.salarioBruto = alert("Debes ingresar un salario bruto anual mayor al Salario Mínimo Interprofesional (15.120€)");
    } else {
    localStorage.setItem("user", user)
    output();
    }
  }
  catch {
    alert("Debes seleccionar el número de pagas al año")
  }
});