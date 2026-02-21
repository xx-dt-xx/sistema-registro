/**
 * CECATI 97 - Sistema de Registro a Cursos
 * Genera dinámicamente los formularios y maneja las inscripciones
 */

document.addEventListener("DOMContentLoaded", function() {
    // ==================== CONFIGURACIÓN ====================
    const CONFIG = {
        claveStorage: "registros",
        claseError: "mensaje-error",
        claseErrorCampo: "error-campo",
        claseExito: "mensaje-exito",
        claseOverlay: "overlay-exito",
        cursos: [
            {
                id: "electricidad",
                titulo: "Curso de electricidad",
                imagen: "imagenes/electricidad.jpg",
                alt: "Instalaciones eléctricas residenciales",
                descripcion: "Aprende instalaciones eléctricas residenciales, circuitos y seguridad."
            },
            {
                id: "carpinteria",
                titulo: "Curso de carpintería",
                imagen: "imagenes/carpinteria.jpg",
                alt: "Taller de carpintería con herramientas profesionales",
                descripcion: "Domina la madera: muebles, acabados y técnicas profesionales."
            },
            {
                id: "corte",
                titulo: "Curso de corte y confección",
                imagen: "imagenes/corte.jpg",
                alt: "Máquina de coser profesional y telas",
                descripcion: "Crea tus propias prendas: patrones, telas y diseño de moda."
            }
        ],
        definicionCampos: {
            // Sección de información del estudiante
            infoEstudiante: [
                {
                    tipo: "text",
                    nombre: "nombre",
                    etiqueta: "Nombre completo",
                    requerido: true,
                    placeholder: "Ej. Juan Pérez López",
                    validacion: {
                        patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        mensaje: "El nombre solo debe contener letras y espacios"
                    }
                },
                {
                    tipo: "email",
                    nombre: "email",
                    etiqueta: "Correo electrónico",
                    requerido: true,
                    placeholder: "ejemplo@correo.com",
                    validacion: {
                        patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        mensaje: "Ingrese un correo electrónico válido"
                    }
                },
                {
                    tipo: "tel",
                    nombre: "telefono",
                    etiqueta: "Teléfono",
                    requerido: true,
                    placeholder: "3312345678",
                    validacion: {
                        patron: /^\d{10}$/,
                        mensaje: "Ingrese 10 dígitos sin espacios ni guiones"
                    }
                },
                {
                    tipo: "fecha",
                    nombre: "fecha_nacimiento",
                    etiqueta: "Fecha de nacimiento",
                    requerido: true,
                    placeholder: "DD/MM/AAAA",
                    validacion: {
                        mensaje: "Debe ser mayor de 15 años"
                    }
                }
            ],
            // Sección de selección del curso
            infoCurso: [
                {
                    tipo: "select",
                    nombre: "nivel",
                    etiqueta: "Nivel del curso",
                    requerido: true,
                    opciones: [
                        { valor: "", texto: "Seleccione un nivel", deshabilitado: true, seleccionado: true },
                        { valor: "introduccion", texto: "Introducción (Sin experiencia)" },
                        { valor: "principiante", texto: "Principiante (Conocimientos básicos)" },
                        { valor: "avanzado", texto: "Avanzado (Experiencia previa)" }
                    ]
                },
                {
                    tipo: "select",
                    nombre: "horario",
                    etiqueta: "Horario preferente",
                    requerido: true,
                    opciones: [
                        { valor: "", texto: "Seleccione un horario", deshabilitado: true, seleccionado: true },
                        { valor: "matutino", texto: "Matutino (8:00 - 12:00 hrs)" },
                        { valor: "vespertino", texto: "Vespertino (14:00 - 18:00 hrs)" },
                        { valor: "sabatino", texto: "Sabatino (9:00 - 13:00 hrs)" }
                    ]
                }
            ]
        }
    };

    // ==================== INICIALIZACIÓN ====================
    inicializarCursos();

    /**
     * Inicializa todas las tarjetas de cursos con sus formularios
     */
    function inicializarCursos() {
        const contenedor = document.getElementById('contenedor-cursos');

        if (!contenedor) {
            console.error("No se encontró el contenedor #contenedor-cursos");
            return;
        }

        // Limpiar contenedor
        contenedor.innerHTML = '';

        // Generar cada curso
        CONFIG.cursos.forEach(curso => {
            const elementoCurso = crearElementoCurso(curso);
            contenedor.appendChild(elementoCurso);
        });

        // Inicializar formularios después de crearlos
        inicializarFormularios();
    }

    /**
     * Crea un artículo de curso con su formulario
     * @param {Object} curso - Datos del curso
     * @returns {HTMLElement} Artículo del curso
     */
    function crearElementoCurso(curso) {
        const articulo = document.createElement('article');
        articulo.id = curso.id;
        articulo.className = 'curso';

        // Encabezado con título e imagen
        const encabezado = document.createElement('header');

        const titulo = document.createElement('h3');
        titulo.textContent = curso.titulo;

        const imagen = document.createElement('img');
        imagen.src = curso.imagen;
        imagen.alt = curso.alt;
        imagen.loading = 'lazy';

        encabezado.appendChild(titulo);
        encabezado.appendChild(imagen);

        // Descripción
        const descripcion = document.createElement('p');
        descripcion.className = 'descripcion-curso';
        descripcion.textContent = curso.descripcion;

        // Formulario
        const formulario = crearFormularioCurso(curso);

        // Ensamblar artículo
        articulo.appendChild(encabezado);
        articulo.appendChild(descripcion);
        articulo.appendChild(formulario);

        return articulo;
    }

    /**
     * Crea un formulario para un curso específico
     * @param {Object} curso - Datos del curso
     * @returns {HTMLFormElement} El formulario generado
     */
    function crearFormularioCurso(curso) {
        const formulario = document.createElement('form');
        formulario.className = 'formulario-curso';
        formulario.dataset.curso = curso.titulo;
        formulario.setAttribute('aria-label', `Formulario de registro para ${curso.titulo}`);
        formulario.setAttribute('novalidate', 'true');

        const fieldset = document.createElement('fieldset');

        const leyenda = document.createElement('legend');
        leyenda.textContent = `Registro al curso de ${curso.titulo}`;
        fieldset.appendChild(leyenda);

        // Agregar sección de información del estudiante
        const seccionEstudiante = document.createElement('div');
        seccionEstudiante.className = 'seccion-formulario';

        const tituloEstudiante = document.createElement('h4');
        tituloEstudiante.className = 'titulo-seccion';
        tituloEstudiante.textContent = 'Datos del estudiante';
        seccionEstudiante.appendChild(tituloEstudiante);

        CONFIG.definicionCampos.infoEstudiante.forEach(definicionCampo => {
            seccionEstudiante.appendChild(crearCampoFormulario(definicionCampo, curso.id));
        });

        fieldset.appendChild(seccionEstudiante);

        // Agregar sección de selección del curso
        const seccionCurso = document.createElement('div');
        seccionCurso.className = 'seccion-formulario';

        const tituloCurso = document.createElement('h4');
        tituloCurso.className = 'titulo-seccion';
        tituloCurso.textContent = 'Selección del curso';
        seccionCurso.appendChild(tituloCurso);

        CONFIG.definicionCampos.infoCurso.forEach(definicionCampo => {
            seccionCurso.appendChild(crearCampoFormulario(definicionCampo, curso.id));
        });

        fieldset.appendChild(seccionCurso);

        // Botón de envío
        const boton = document.createElement('button');
        boton.type = 'submit';
        boton.textContent = 'Registrar en el curso';

        fieldset.appendChild(boton);
        formulario.appendChild(fieldset);

        return formulario;
    }

    /**
     * Crea un campo de formulario basado en su definición
     * @param {Object} definicionCampo - Definición del campo
     * @param {string} cursoId - ID del curso para IDs únicos
     * @returns {HTMLElement} Div del grupo de formulario
     */
    function crearCampoFormulario(definicionCampo, cursoId) {
        const grupoFormulario = document.createElement('div');
        grupoFormulario.className = 'grupo-formulario';

        const campoId = `${cursoId}-${definicionCampo.nombre}-${Math.random().toString(36).substr(2, 6)}`;

        // Etiqueta
        const etiqueta = document.createElement('label');
        etiqueta.htmlFor = campoId;
        etiqueta.textContent = definicionCampo.etiqueta + (definicionCampo.requerido ? ' *' : '');

        // Campo
        let campo;
        if (definicionCampo.tipo === 'select') {
            campo = document.createElement('select');
            definicionCampo.opciones.forEach(opcion => {
                const option = document.createElement('option');
                option.value = opcion.valor;
                option.textContent = opcion.texto;
                if (opcion.deshabilitado) option.disabled = true;
                if (opcion.seleccionado) option.selected = true;
                campo.appendChild(option);
            });
        } else if (definicionCampo.tipo === 'fecha') {
            // Campo de fecha personalizado con formato DD/MM/AAAA
            campo = document.createElement('input');
            campo.type = 'text';
            campo.placeholder = definicionCampo.placeholder || 'DD/MM/AAAA';
            campo.inputMode = 'numeric';
            campo.pattern = '\\d{2}/\\d{2}/\\d{4}';
            campo.maxLength = 10;

            // Agregar evento para formatear automáticamente
            campo.addEventListener('input', function(e) {
                formatearFechaInput(this);
            });

            campo.addEventListener('blur', function(e) {
                validarFechaCompleta(this);
            });
        } else {
            campo = document.createElement('input');
            campo.type = definicionCampo.tipo;
            if (definicionCampo.placeholder) {
                campo.placeholder = definicionCampo.placeholder;
            }
        }

        campo.id = campoId;
        campo.name = definicionCampo.nombre;
        if (definicionCampo.requerido) campo.required = true;

        // Guardar información de validación como atributos data
        if (definicionCampo.validacion) {
            if (definicionCampo.validacion.patron) {
                campo.dataset.patron = definicionCampo.validacion.patron.source;
            }
            campo.dataset.mensajeValidacion = definicionCampo.validacion.mensaje || 'Campo inválido';
        }

        grupoFormulario.appendChild(etiqueta);
        grupoFormulario.appendChild(campo);

        return grupoFormulario;
    }

    /**
     * Formatea automáticamente la entrada de fecha
     * @param {HTMLInputElement} input - Campo de entrada
     */
    function formatearFechaInput(input) {
        let valor = input.value.replace(/\D/g, ''); // Eliminar no dígitos

        if (valor.length <= 2) {
            input.value = valor;
        } else if (valor.length <= 4) {
            input.value = valor.substring(0, 2) + '/' + valor.substring(2);
        } else {
            input.value = valor.substring(0, 2) + '/' + valor.substring(2, 4) + '/' + valor.substring(4, 8);
        }
    }

    /**
     * Valida que la fecha sea completa y tenga formato correcto
     * @param {HTMLInputElement} input - Campo de entrada
     * @returns {boolean} Si la fecha es válida
     */
    function validarFechaCompleta(input) {
        const valor = input.value;
        const patron = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = valor.match(patron);

        if (!match) {
            return false;
        }

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10) - 1; // Mes en JS es 0-11
        const anio = parseInt(match[3], 10);

        const fecha = new Date(anio, mes, dia);

        // Verificar que la fecha sea válida (ej. no 31/02/2024)
        return fecha.getDate() === dia &&
               fecha.getMonth() === mes &&
               fecha.getFullYear() === anio;
    }

    // ==================== MANEJO DE FORMULARIOS ====================

    /**
     * Inicializa todos los formularios con validación
     */
    function inicializarFormularios() {
        const formularios = document.querySelectorAll(".formulario-curso");

        if (formularios.length === 0) {
            console.warn("No se encontraron formularios de curso");
            return;
        }

        formularios.forEach(formulario => {
            configurarValidacionFormulario(formulario);
        });
    }

    /**
     * Configura la validación y envío del formulario
     * @param {HTMLFormElement} formulario - El formulario a configurar
     */
    function configurarValidacionFormulario(formulario) {
        // Agregar validación al perder el foco
        const campos = formulario.querySelectorAll('input, select');
        campos.forEach(campo => {
            campo.addEventListener('blur', function() {
                validarCampo(this);
            });

            campo.addEventListener('input', function() {
                quitarErrorCampo(this);
            });
        });

        // Agregar manejador de envío
        formulario.addEventListener('submit', manejarEnvio);
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento de envío
     */
    function manejarEnvio(e) {
        e.preventDefault();

        const formulario = e.target;

        // Limpiar todos los errores anteriores
        limpiarTodosErrores(formulario);

        // Validar todos los campos
        const esValido = validarFormulario(formulario);

        if (!esValido) {
            mostrarErrorFormulario(formulario, 'Por favor corrija los errores en el formulario.');
            return;
        }

        // Obtener datos del formulario
        const datosFormulario = recogerDatosFormulario(formulario);

        // Guardar en localStorage
        const guardado = guardarEnLocalStorage(datosFormulario);

        if (guardado) {
            // Mostrar overlay de éxito
            mostrarOverlayExito(formulario, datosFormulario.curso);

            // Registrar para depuración
            console.log('Registro guardado:', datosFormulario);
        } else {
            mostrarErrorFormulario(formulario, 'Error al guardar el registro. Intente nuevamente.');
        }
    }

    /**
     * Muestra un overlay de éxito sobre el formulario
     * @param {HTMLFormElement} formulario - El formulario
     * @param {string} nombreCurso - Nombre del curso
     */
    function mostrarOverlayExito(formulario, nombreCurso) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = CONFIG.claseOverlay;

        // Crear contenido del overlay
        const contenido = document.createElement('div');
        contenido.className = 'contenido-overlay';

        const icono = document.createElement('div');
        icono.className = 'icono-exito';
        icono.textContent = '✓';

        const titulo = document.createElement('h3');
        titulo.textContent = '¡Registro Exitoso!';

        const mensaje = document.createElement('p');
        mensaje.textContent = `Te has inscrito correctamente al curso de ${nombreCurso}`;

        const detalle = document.createElement('p');
        detalle.className = 'detalle-overlay';
        detalle.textContent = 'Pronto recibirás más información en tu correo electrónico.';

        const boton = document.createElement('button');
        boton.className = 'boton-overlay';
        boton.textContent = 'Cerrar';
        boton.addEventListener('click', () => {
            overlay.remove();
            formulario.reset();
        });

        // Ensamblar overlay
        contenido.appendChild(icono);
        contenido.appendChild(titulo);
        contenido.appendChild(mensaje);
        contenido.appendChild(detalle);
        contenido.appendChild(boton);
        overlay.appendChild(contenido);

        // Agregar al formulario
        formulario.style.position = 'relative';
        formulario.appendChild(overlay);

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
                formulario.reset();
            }
        }, 5000);
    }

    /**
     * Valida todo el formulario
     * @param {HTMLFormElement} formulario - El formulario a validar
     * @returns {boolean} Si el formulario es válido
     */
    function validarFormulario(formulario) {
        let esValido = true;

        const camposRequeridos = formulario.querySelectorAll('[required]');
        camposRequeridos.forEach(campo => {
            if (!validarCampo(campo)) {
                esValido = false;
            }
        });

        // Validación especial para fecha de nacimiento
        const campoFecha = formulario.querySelector('input[name="fecha_nacimiento"]');
        if (campoFecha && campoFecha.value) {
            if (!validarFechaNacimiento(campoFecha.value)) {
                mostrarErrorCampo(campoFecha, 'Debe ser mayor de 15 años');
                esValido = false;
            } else if (!validarFechaCompleta(campoFecha)) {
                mostrarErrorCampo(campoFecha, 'Ingrese una fecha válida en formato DD/MM/AAAA');
                esValido = false;
            }
        }

        return esValido;
    }

    /**
     * Valida un campo individual
     * @param {HTMLElement} campo - Campo a validar
     * @returns {boolean} Si el campo es válido
     */
    function validarCampo(campo) {
        quitarErrorCampo(campo);

        // Validación de requerido
        if (campo.required && !campo.value.trim()) {
            mostrarErrorCampo(campo, 'Este campo es requerido');
            return false;
        }

        // Validación de patrón desde atributo data
        if (campo.dataset.patron && campo.value.trim()) {
            const patron = new RegExp(campo.dataset.patron);
            if (!patron.test(campo.value.trim())) {
                mostrarErrorCampo(campo, campo.dataset.mensajeValidacion || 'Formato inválido');
                return false;
            }
        }

        // Validación de select
        if (campo.tagName === 'SELECT' && campo.required && !campo.value) {
            mostrarErrorCampo(campo, 'Seleccione una opción');
            return false;
        }

        return true;
    }

    /**
     * Valida fecha de nacimiento (debe ser mayor de 15 años)
     * @param {string} fechaStr - String de fecha en formato DD/MM/AAAA
     * @returns {boolean} Si es válida
     */
    function validarFechaNacimiento(fechaStr) {
        const partes = fechaStr.split('/');
        if (partes.length !== 3) return false;

        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Mes en JS es 0-11
        const anio = parseInt(partes[2], 10);

        const fechaNacimiento = new Date(anio, mes, dia);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const diffMes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (diffMes < 0 || (diffMes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            return edad - 1 >= 15;
        }

        return edad >= 15;
    }

    /**
     * Recoge todos los datos del formulario
     * @param {HTMLFormElement} formulario - El formulario
     * @returns {Object} Objeto con los datos del formulario
     */
    function recogerDatosFormulario(formulario) {
        const datosFormulario = new FormData(formulario);
        const datos = {};

        for (let [clave, valor] of datosFormulario.entries()) {
            datos[clave] = valor.trim();
        }

        // Agregar metadatos
        datos.curso = formulario.dataset.curso;
        datos.fechaRegistro = new Date().toISOString();
        datos.id = generarId();

        return datos;
    }

    /**
     * Genera ID único
     * @returns {string} ID único
     */
    function generarId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Guarda datos en localStorage
     * @param {Object} datos - Datos del formulario
     * @returns {boolean} Estado de éxito
     */
    function guardarEnLocalStorage(datos) {
        try {
            let registros = JSON.parse(localStorage.getItem(CONFIG.claveStorage)) || [];
            registros.push(datos);
            localStorage.setItem(CONFIG.claveStorage, JSON.stringify(registros));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    }

    // ==================== FUNCIONES AUXILIARES DE UI ====================

    function mostrarErrorCampo(campo, mensaje) {
        quitarErrorCampo(campo);

        campo.classList.add(CONFIG.claseErrorCampo);

        const errorDiv = document.createElement('div');
        errorDiv.className = CONFIG.claseError;
        errorDiv.textContent = mensaje;

        campo.parentNode.appendChild(errorDiv);
    }

    function quitarErrorCampo(campo) {
        campo.classList.remove(CONFIG.claseErrorCampo);

        const errorExistente = campo.parentNode.querySelector(`.${CONFIG.claseError}`);
        if (errorExistente) {
            errorExistente.remove();
        }
    }

    function mostrarErrorFormulario(formulario, mensaje) {
        quitarErrorFormulario(formulario);

        const errorDiv = document.createElement('div');
        errorDiv.className = CONFIG.claseError + ' error-formulario';
        errorDiv.textContent = mensaje;

        formulario.insertBefore(errorDiv, formulario.firstChild);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function quitarErrorFormulario(formulario) {
        const errorExistente = formulario.querySelector('.error-formulario');
        if (errorExistente) {
            errorExistente.remove();
        }
    }

    function limpiarTodosErrores(formulario) {
        quitarErrorFormulario(formulario);
        formulario.querySelectorAll(`.${CONFIG.claseError}`).forEach(error => error.remove());
        formulario.querySelectorAll(`.${CONFIG.claseErrorCampo}`).forEach(campo => {
            campo.classList.remove(CONFIG.claseErrorCampo);
        });
    }
});