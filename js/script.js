const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const progress = document.querySelector('#reading-progress');
const topButton = document.querySelector('#back-to-top');

const cycleContent = {
  fetch: 'La CPU obtiene la instrucción desde la memoria.',
  decode: 'La unidad de control interpreta la instrucción recibida.',
  execute: 'El procesador ejecuta la operación indicada.'
};

const memoryContent = {
  register: ['Registros', 'Son el nivel más veloz y pequeño. Guardan datos e instrucciones de uso inmediato dentro de la CPU.'],
  cache: ['Memoria cache', 'Almacena datos frecuentes cerca del procesador para reducir el tiempo de acceso.'],
  ram: ['Memoria RAM', 'Mantiene temporalmente los programas y datos que están siendo utilizados por el sistema.'],
  storage: ['Almacenamiento secundario', 'Conserva grandes volúmenes de información aunque el equipo se apague.']
};

const topologies = {
  star: {
    label: 'TOPOLOGÍA 01', title: 'Estrella', description: 'Todos los dispositivos se conectan a un nodo central que gestiona el tráfico.', pro: 'Fácil de administrar y detectar fallos.', con: 'El nodo central es un punto crítico.'
  },
  ring: {
    label: 'TOPOLOGÍA 02', title: 'Anillo', description: 'Cada dispositivo se conecta con otros dos y forma un circuito cerrado.', pro: 'El acceso al medio es ordenado.', con: 'Una interrupción puede afectar el recorrido completo.'
  },
  bus: {
    label: 'TOPOLOGÍA 03', title: 'Bus', description: 'Todos los dispositivos comparten un canal principal de comunicación.', pro: 'Requiere poco cableado.', con: 'El canal compartido puede saturarse.'
  }
};

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
}

setTheme(localStorage.getItem('theme') || 'light');
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable ? window.scrollY / scrollable : 0})`;
  topButton.classList.toggle('visible', window.scrollY > 500);
});
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('#cycle-button').addEventListener('click', () => {
  const steps = [...document.querySelectorAll('.cycle-step')];
  steps.forEach((step, index) => setTimeout(() => {
    steps.forEach(item => item.classList.remove('active'));
    step.classList.add('active');
    document.querySelector('#cycle-description').textContent = cycleContent[step.dataset.step];
  }, index * 700));
});

document.querySelectorAll('[data-memory]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-memory]').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  const [title, description] = memoryContent[button.dataset.memory];
  document.querySelector('#memory-info').innerHTML = `<b>${title}</b><span>${description}</span>`;
}));

document.querySelector('#packet-button').addEventListener('click', () => {
  const packet = document.querySelector('#packet');
  packet.classList.remove('traveling');
  void packet.offsetWidth;
  packet.classList.add('traveling');
});

function drawTopology(type) {
  const graphic = document.querySelector('#topology-graphic');
  graphic.innerHTML = '';
  const positions = type === 'star' ? [[50, 48], [15, 15], [82, 15], [15, 80], [82, 80]] : type === 'ring' ? [[50, 8], [85, 35], [72, 82], [28, 82], [15, 35]] : [[12, 50], [34, 50], [56, 50], [78, 50]];
  const center = type === 'star' ? positions[0] : null;
  const lineTargets = type === 'star' ? positions.slice(1) : positions;
  if (type === 'star') lineTargets.forEach(position => addLine(center, position));
  if (type === 'ring') positions.forEach((position, index) => addLine(position, positions[(index + 1) % positions.length]));
  if (type === 'bus') addLine([5, 50], [95, 50]);
  positions.forEach(position => addNode(position));
  function addNode([left, top]) { const node = document.createElement('span'); node.className = 'topo-node'; node.style.left = `${left}%`; node.style.top = `${top}%`; graphic.appendChild(node); }
  function addLine([left, top], [endLeft, endTop]) { const line = document.createElement('i'); line.className = 'topo-line'; const length = Math.hypot(endLeft - left, endTop - top); line.style.left = `${left}%`; line.style.top = `${top}%`; line.style.width = `${length}%`; line.style.transform = `rotate(${Math.atan2(endTop - top, endLeft - left) * 180 / Math.PI}deg)`; graphic.appendChild(line); }
}

document.querySelectorAll('.topology-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.topology-tab').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const data = topologies[button.dataset.topology];
  document.querySelector('#topology-label').textContent = data.label;
  document.querySelector('#topology-title').textContent = data.title;
  document.querySelector('#topology-description').textContent = data.description;
  document.querySelector('#topology-pro').textContent = data.pro;
  document.querySelector('#topology-con').textContent = data.con;
  drawTopology(button.dataset.topology);
}));
drawTopology('star');

document.querySelector('#pdf-button').addEventListener('click', () => window.print());

const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
