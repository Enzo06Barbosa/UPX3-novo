var menuIcon = document.querySelector('.menu-icon');
var ul = document.querySelector('.ul');

menuIcon.addEventListener('click', ()=>{
    
    if (ul.classList.contains('ativo')){
        ul.classList.remove('ativo')
        document.querySelector('.menu-icon img').src = 'img/menu.png'
    }else{
        ul.classList.add('ativo')
        document.querySelector('.menu-icon img').src = 'img/close.png'
    }

})



document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos DENTRO do escopo do formulário do alimentador para evitar conflitos
    const formAlimentador = document.querySelector('.formulario-alimentador-container');
    if (!formAlimentador) { 
        console.error("Container do formulário do alimentador não encontrado. O script do alimentador não será executado.");
        return;
    }

    const novoHorarioInput = formAlimentador.querySelector('#novo-horario');
    const btnAdicionar = formAlimentador.querySelector('#btn-adicionar');
    const listaHorariosUl = formAlimentador.querySelector('#lista-horarios');
    const semHorariosMsg = formAlimentador.querySelector('#sem-horarios');
    const btnDespejar = formAlimentador.querySelector('#btn-despejar');
    
    const toastNotification = document.getElementById('toast-notification'); 
    const currentYearSpan = formAlimentador.querySelector('#currentYear'); 

    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    let horariosAgendados = [];
    try {
        const storedHorarios = localStorage.getItem('horariosAlimentadorPet');
        if (storedHorarios) {
            horariosAgendados = JSON.parse(storedHorarios);
        }
    } catch (error) {
        console.error("Erro ao carregar horários do localStorage:", error);
        horariosAgendados = [];
    }

    function mostrarToast(mensagem, tipo = 'info') {
        if (!toastNotification) return;
        toastNotification.textContent = mensagem;
        toastNotification.className = `toast ${tipo} show`;
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000);
    }

    function renderizarHorarios() {
        if (!listaHorariosUl || !semHorariosMsg) return;
        listaHorariosUl.innerHTML = ''; 

        if (horariosAgendados.length === 0) {
            semHorariosMsg.classList.remove('hidden');
        } else {
            semHorariosMsg.classList.add('hidden');
            horariosAgendados.sort();
            horariosAgendados.forEach((horario, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'bg-slate-600 p-3 rounded-md flex justify-between items-center shadow';
                
                const horarioText = document.createElement('span');
                horarioText.textContent = horario;
                horarioText.className = 'text-slate-100';
                listItem.appendChild(horarioText);

                const btnRemover = document.createElement('button');
                btnRemover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
                btnRemover.className = 'text-red-400 hover:text-red-500 transition-colors duration-150 ease-in-out p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 icon-button';
                btnRemover.setAttribute('aria-label', `Remover horário ${horario}`);
                btnRemover.onclick = () => removerHorario(index);
                listItem.appendChild(btnRemover);
                
                listaHorariosUl.appendChild(listItem);
            });
        }
    }

    function adicionarHorario() {
        if (!novoHorarioInput) return;
        const horarioValor = novoHorarioInput.value;
        if (horarioValor) {
            if (horariosAgendados.includes(horarioValor)) {
                mostrarToast('Este horário já foi adicionado.', 'error');
                return;
            }
            horariosAgendados.push(horarioValor);
            salvarHorarios();
            renderizarHorarios();
            novoHorarioInput.value = ''; 
            mostrarToast('Horário adicionado com sucesso!', 'success');
        } else {
            mostrarToast('Por favor, insira um horário válido.', 'error');
        }
    }

    function removerHorario(index) {
        const horarioRemovido = horariosAgendados[index];
        horariosAgendados.splice(index, 1);
        salvarHorarios();
        renderizarHorarios();
        mostrarToast(`Horário ${horarioRemovido} removido.`, 'info');
    }

    function salvarHorarios() {
        try {
            localStorage.setItem('horariosAlimentadorPet', JSON.stringify(horariosAgendados));
        } catch (error) {
            console.error("Erro ao salvar horários no localStorage:", error);
            mostrarToast('Não foi possível salvar os horários. O armazenamento pode estar cheio ou indisponível.', 'error');
        }
    }

    function despejarComidaAgora() {
        if(!btnDespejar) return;
        mostrarToast('Comida despejada! 🍖', 'success');
        console.log('ACIONAMENTO MANUAL: Despejando comida...');
        btnDespejar.disabled = true;
        btnDespejar.classList.add('opacity-50', 'cursor-not-allowed');
        setTimeout(() => {
            btnDespejar.disabled = false;
            btnDespejar.classList.remove('opacity-50', 'cursor-not-allowed');
            console.log('ACIONAMENTO MANUAL: Finalizado.');
        }, 2000);
    }

    if(btnAdicionar) btnAdicionar.addEventListener('click', adicionarHorario);
    if(novoHorarioInput) novoHorarioInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            adicionarHorario();
        }
    });
    if(btnDespejar) btnDespejar.addEventListener('click', despejarComidaAgora);

    renderizarHorarios();
});



window.addEventListener('scroll', function(){
    let scroll = document.querySelector('.scrollTop')
        scroll.classList.toggle('active', this.window.scrollY > 450)
})

function backTop() {
    window.scrollTo ({
        top: 0
    })
}

// Carrossel de Imagens na seção principal
document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.main-carousel .carousel-inner');
    const carouselItems = document.querySelectorAll('.main-carousel .carousel-item');
    const prevBtn = document.querySelector('.main-carousel .carousel-control.prev');
    const nextBtn = document.querySelector('.main-carousel .carousel-control.next');
    const indicatorsContainer = document.querySelector('.main-carousel .carousel-indicators');

    if (!carouselInner || carouselItems.length === 0 || !prevBtn || !nextBtn || !indicatorsContainer) {
        console.warn("Elementos do carrossel não encontrados. O carrossel não será inicializado.");
        return;
    }

    let currentIndex = 0;
    const totalItems = carouselItems.length;

    // Função para criar os indicadores (bolinhas)
    function createIndicators() {
        indicatorsContainer.innerHTML = ''; // Limpa indicadores existentes
        carouselItems.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === currentIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    // Função para navegar para um slide específico
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalItems - 1;
        } else if (index >= totalItems) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        const offset = -currentIndex * 100; // Calcula o deslocamento em %
        carouselInner.style.transform = `translateX(${offset}%)`;

        // Atualiza os indicadores
        document.querySelectorAll('.carousel-indicators .indicator').forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Navegação pelos botões
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Inicializa o carrossel e os indicadores
    createIndicators();
    goToSlide(currentIndex); // Garante que o primeiro slide e indicador estejam ativos ao carregar
});