// ===== JAVASCRIPT PARA HOSPITAL JPCT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Junta Particular de Caridad de Teziutlán - Página cargada correctamente');
    
    // Inicializar todas las funcionalidades
    inicializarNavegacion();
    inicializarMenuMovil();
    inicializarFormularios();
    inicializarAnimaciones();
    inicializarModoOscuro();
    mostrarHoraActual();
    
    // Actualizar hora cada minuto
    setInterval(mostrarHoraActual, 60000);
});

// ===== NAVEGACIÓN SUAVE =====
function inicializarNavegacion() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Cerrar menú móvil si está abierto
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
                
                // Scroll suave a la sección
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Resaltar enlace activo
                actualizarEnlaceActivo(this);
            }
        });
    });
}

// ===== MENÚ MÓVIL (HAMBURGUESA) =====
function inicializarMenuMovil() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animar las líneas del hamburger
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'rotate(0) translate(0, 0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0) translate(0, 0)';
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                resetearHamburger();
            }
        });
    }
}

function resetearHamburger() {
    const spans = document.querySelectorAll('.hamburger span');
    spans.forEach(span => {
        span.style.transform = 'rotate(0) translate(0, 0)';
        span.style.opacity = '1';
    });
}

// ===== FORMULARIOS =====
function inicializarFormularios() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            manejarEnvioFormulario(this);
        });
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validarCampo(this);
            });
            
            input.addEventListener('input', function() {
                limpiarErrores(this);
            });
        });
    }
}

function manejarEnvioFormulario(form) {
    const formData = new FormData(form);
    let esValido = true;
    
    // Validar todos los campos
    const campos = form.querySelectorAll('input[required], textarea[required], select[required]');
    campos.forEach(campo => {
        if (!validarCampo(campo)) {
            esValido = false;
        }
    });
    
    if (esValido) {
        mostrarMensaje('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.', 'exito');
        form.reset();
        
        // Aquí puedes agregar la lógica para enviar el formulario al servidor
        console.log('Formulario válido:', Object.fromEntries(formData));
    } else {
        mostrarMensaje('Por favor, completa todos los campos requeridos.', 'error');
    }
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    let esValido = true;
    
    // Limpiar errores previos
    limpiarErrores(campo);
    
    // Validación básica de campos requeridos
    if (campo.hasAttribute('required') && valor === '') {
        mostrarError(campo, 'Este campo es requerido');
        esValido = false;
    }
    
    // Validación de email
    if (campo.type === 'email' && valor !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            mostrarError(campo, 'Ingresa un email válido');
            esValido = false;
        }
    }
    
    // Validación de teléfono
    if (campo.type === 'tel' && valor !== '') {
        const telefonoRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!telefonoRegex.test(valor)) {
            mostrarError(campo, 'Ingresa un teléfono válido');
            esValido = false;
        }
    }
    
    return esValido;
}

function mostrarError(campo, mensaje) {
    campo.style.borderColor = '#e74c3c';
    
    // Crear o actualizar mensaje de error
    let errorMsg = campo.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 5px;';
        campo.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = mensaje;
}

function limpiarErrores(campo) {
    campo.style.borderColor = '#e9ecef';
    const errorMsg = campo.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// ===== ANIMACIONES Y EFECTOS =====
function inicializarAnimaciones() {
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animar estadísticas si es la sección hero
                if (entry.target.classList.contains('hero')) {
                    animarEstadisticas();
                }
            }
        });
    }, observerOptions);
    
    // Observar secciones para animaciones
    const secciones = document.querySelectorAll('section');
    secciones.forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(seccion);
    });
}

function animarEstadisticas() {
    const statsItems = document.querySelectorAll('.stat-item h3');
    
    statsItems.forEach((stat, index) => {
        const finalValue = stat.textContent;
        let currentValue = 0;
        let increment;
        
        // Determinar incremento basado en el valor final
        if (finalValue.includes('+')) {
            const numValue = parseInt(finalValue.replace('+', ''));
            increment = numValue / 50; // 50 pasos para la animación
        } else if (finalValue.includes('/')) {
            stat.textContent = finalValue; // No animar valores como "24/7"
            return;
        }
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= parseInt(finalValue.replace('+', ''))) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue) + '+';
            }
        }, 20);
    });
}

// ===== UTILIDADES =====
function actualizarEnlaceActivo(enlaceActual) {
    // Remover clase activa de todos los enlaces
    const todosLosEnlaces = document.querySelectorAll('.nav-menu a');
    todosLosEnlaces.forEach(enlace => {
        enlace.classList.remove('active');
    });
    
    // Agregar clase activa al enlace actual
    enlaceActual.classList.add('active');
}

function mostrarHoraActual() {
    const ahora = new Date();
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    
    // Actualizar en la barra superior si existe
    const horaElement = document.querySelector('.hora-actual');
    if (horaElement) {
        horaElement.textContent = fechaFormateada;
    }
    
    console.log('Junta Particular de Caridad de Teziutlán - Hora actual:', fechaFormateada);
}

function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-temporal ${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    // Estilos del mensaje
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${tipo === 'exito' ? 'background-color: #27ae60;' : 'background-color: #e74c3c;'}
    `;
    
    document.body.appendChild(mensajeDiv);
    
    // Animar entrada
    setTimeout(() => {
        mensajeDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        mensajeDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 5000);
}

// ===== FUNCIONES PARA EMERGENCIAS =====
function llamarEmergencia() {
    if (confirm('¿Deseas llamar al servicio de emergencias 911?')) {
        window.location.href = 'tel:911';
    }
}

// ===== FUNCIONES ADICIONALES PARA HOSPITAL =====
function abrirMapaUbicacion() {
    // Aquí puedes agregar la dirección real del hospital
    const direccion = encodeURIComponent('[DIRECCIÓN DEL HOSPITAL]');
    window.open(`https://maps.google.com/?q=${direccion}`, '_blank');
}

function compartirPagina() {
    if (navigator.share) {
        navigator.share({
            title: 'Hospital JPCT',
            text: 'Centro Médico de Excelencia',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(window.location.href);
        mostrarMensaje('Enlace copiado al portapapeles', 'exito');
    }
}

// ===== EVENTOS GLOBALES =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Prevenir zoom en dispositivos móviles (opcional)
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

// Función para imprimir página
function imprimirPagina() {
    window.print();
}

// ===== MODO OSCURO/CLARO =====
function inicializarModoOscuro() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Verificar tema guardado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Establecer tema inicial
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Event listener para el botón toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        
        // Mostrar mensaje de confirmación
        mostrarMensajeTheme(newTheme);
    });
    
    // Detectar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    const themeIcon = document.getElementById('theme-icon');
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', theme);
    
    // Cambiar icono
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.title = 'Cambiar a modo claro';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.title = 'Cambiar a modo oscuro';
    }
    
    // Animación del body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function mostrarMensajeTheme(theme) {
    // Crear mensaje temporal
    const mensaje = document.createElement('div');
    mensaje.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-color);
        color: var(--white);
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
    `;
    
    mensaje.textContent = theme === 'dark' ? 
        '🌙 Modo oscuro activado' : 
        '☀️ Modo claro activado';
    
    document.body.appendChild(mensaje);
    
    // Remover mensaje después de 2 segundos
    setTimeout(() => {
        mensaje.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (mensaje.parentNode) {
                mensaje.parentNode.removeChild(mensaje);
            }
        }, 300);
    }, 2000);
}

// Agregar CSS para animaciones del mensaje
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);