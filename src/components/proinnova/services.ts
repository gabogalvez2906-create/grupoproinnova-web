/**
 * Service landing pages (/servicios/<slug>/). One entry = one page, its SEO head,
 * its JSON-LD and its links from the home page, the hub and the footer.
 *
 * Copy rules: only claims the company already makes (see ProinnovaHome), no prices,
 * no invented clients, years or certifications. Photos are real work from the
 * catalogue; captions describe what the photo shows.
 */
import naveTragaluces from "../../assets/obra/nave-industrial-tragaluces.webp";
import naveTragalucesJpg from "../../assets/obra/nave-industrial-tragaluces.jpg";
import plantaIndustrial from "../../assets/obra/planta-industrial.webp";
import bodegaMontacargas from "../../assets/obra/bodega-industrial-montacargas.webp";
import estructuraMetalica from "../../assets/obra/estructura-metalica.webp";
import estructuraMetalicaJpg from "../../assets/obra/estructura-metalica.jpg";
import edificioComercial from "../../assets/obra/edificio-comercial-obra-gris.webp";
import oficinaTablayeso from "../../assets/obra/oficina-remodelacion-tablayeso.webp";
import oficinaTablayesoJpg from "../../assets/obra/oficina-remodelacion-tablayeso.jpg";
import showroomSala from "../../assets/obra/showroom-sala-clientes.webp";
import oficinaLounge from "../../assets/obra/oficina-lounge.webp";
import oficinaIluminacion from "../../assets/obra/oficina-iluminacion.webp";
import pizzaHut from "../../assets/obra/pizza-hut-fachada.webp";
import pizzaHutJpg from "../../assets/obra/pizza-hut-fachada.jpg";
import showroomAutomotriz from "../../assets/obra/showroom-automotriz.webp";
import excavadora from "../../assets/obra/excavadora-terreno.webp";
import excavadoraJpg from "../../assets/obra/excavadora-terreno.jpg";
import muroGaviones from "../../assets/obra/muro-gaviones.webp";
import obrerosColado from "../../assets/obra/obreros-colado-losa.webp";
import obrerosColadoJpg from "../../assets/obra/obreros-colado-losa.jpg";
import gruaColado from "../../assets/obra/grua-colado-atardecer.webp";
import estructuraConcreto from "../../assets/obra/estructura-concreto-multinivel.webp";
import estructuraConcretoJpg from "../../assets/obra/estructura-concreto-multinivel.jpg";
import torreResidencial from "../../assets/obra/torre-residencial.webp";
import edificioAndamios from "../../assets/obra/edificio-andamios-malla.webp";
import interiorObraGris from "../../assets/obra/interior-obra-gris-atardecer.webp";
import recepcion from "../../assets/obra/recepcion-corporativa.webp";
import recepcionJpg from "../../assets/obra/recepcion-corporativa.jpg";
import residencia from "../../assets/obra/residencia-fachada-madera.webp";
import ingenierosPlanos from "../../assets/obra/ingenieros-revisando-planos.webp";
import ingenierosPlanosJpg from "../../assets/obra/ingenieros-revisando-planos.jpg";

export interface Photo {
  src: string;
  alt: string;
}

export interface Service {
  slug: string;
  /** Short name: menus, breadcrumbs, cards. */
  name: string;
  /** One line for cards and the footer. */
  summary: string;
  seoTitle: string;
  seoDescription: string;
  /** Small line printed above the H1, inside it (carries the location keyword). */
  eyebrow: string;
  h1: string;
  lead: string;
  hero: Photo;
  /** JPG twin of the hero for link previews (og:image). */
  heroJpg: string;
  facts: { label: string; value: string }[];
  intro: { title: string; paragraphs: string[] };
  scope: { title: string; items: { title: string; desc: string }[] };
  gallery: { title: string; photos: Photo[] };
  faqs: { q: string; a: string }[];
  related: string[];
  contactTitle: string;
}

export const SERVICES: Service[] = [
  {
    slug: "naves-industriales",
    name: "Naves industriales",
    summary: "Naves, bodegas, ofibodegas y plantas de producción llave en mano.",
    seoTitle: "Construcción de Naves Industriales en Guatemala | Proinnova",
    seoDescription:
      "Construimos naves industriales, bodegas y ofibodegas en Guatemala: terracería, estructura metálica, cubierta, pisos e instalaciones. Presupuesto desglosado.",
    eyebrow: "Construcción industrial · Guatemala",
    h1: "Construcción de naves industriales y bodegas en Guatemala",
    lead: "Diseñamos y construimos naves, bodegas, ofibodegas y plantas de producción llave en mano: de la terracería a la cubierta, con un solo responsable y un presupuesto desglosado desde el inicio.",
    hero: { src: naveTragaluces, alt: "Nave industrial con estructura metálica y tragaluces en la cubierta" },
    heroJpg: naveTragalucesJpg,
    facts: [
      { label: "Tipo de obra", value: "Naves, bodegas y plantas" },
      { label: "Modalidad", value: "Llave en mano o por fases" },
      { label: "Especialidades", value: "Obra civil, estructura e instalaciones" },
    ],
    intro: {
      title: "Una nave se diseña alrededor de su operación.",
      paragraphs: [
        "Una nave industrial no es una caja grande: es la herramienta de trabajo de su empresa. La altura libre, la separación entre columnas, la capacidad del piso y la ubicación de andenes y accesos definen cuánto rinde su operación durante años. Por eso empezamos por entender cómo se mueven la mercancía, la maquinaria y las personas dentro del espacio, y a partir de ahí diseñamos la estructura.",
        "Integramos en un mismo proyecto la obra civil, la estructura metálica, la cubierta, los pisos industriales y las instalaciones eléctricas e hidrosanitarias. Al coordinar todas las especialidades desde los planos evitamos los cambios en obra que suelen encarecer y retrasar un proyecto industrial.",
        "Construimos bodegas de almacenaje y distribución, ofibodegas, naves de manufactura y plantas de producción, como obra nueva o como ampliación de instalaciones existentes, programando los trabajos para no detener su operación.",
      ],
    },
    scope: {
      title: "Todo lo que lleva su nave, bajo un mismo contrato",
      items: [
        { title: "Terracería y cimentación", desc: "Corte, relleno, compactación y cimentaciones dimensionadas para las cargas reales de su operación." },
        { title: "Estructura metálica", desc: "Marcos, columnas, vigas y costaneras para grandes claros sin apoyos intermedios." },
        { title: "Cubierta y cerramientos", desc: "Lámina o panel termoacústico, tragaluces para luz natural, canales y bajadas pluviales." },
        { title: "Pisos industriales", desc: "Losas de concreto preparadas para tránsito de montacargas y cargas de estantería." },
        { title: "Instalaciones", desc: "Electricidad en baja y media tensión, iluminación, agua potable, drenajes y sistema pluvial." },
        { title: "Oficinas y áreas de servicio", desc: "Oficinas, mezanines, baños y áreas de personal integrados a la nave." },
      ],
    },
    gallery: {
      title: "Naves y plantas en obra",
      photos: [
        { src: plantaIndustrial, alt: "Planta industrial con cubierta metálica en etapa de instalaciones" },
        { src: bodegaMontacargas, alt: "Bodega industrial con piso para tránsito de montacargas" },
        { src: estructuraMetalica, alt: "Montaje de estructura metálica para cubierta de nave" },
      ],
    },
    faqs: [
      {
        q: "¿Cuánto cuesta construir una nave industrial en Guatemala?",
        a: "Depende del área, la altura libre, la separación entre columnas, el tipo de cubierta, la capacidad del piso y las condiciones del terreno. Por eso no damos precios por metro cuadrado a ciegas: visitamos el terreno, definimos el alcance con usted y entregamos un presupuesto desglosado por actividad, sin costos ocultos.",
      },
      {
        q: "¿Pueden construir la nave llave en mano?",
        a: "Sí. Podemos encargarnos de todo, desde el diseño, los planos y la terracería hasta la estructura, la cubierta, los pisos y las instalaciones. Si ya tiene un diseño o una obra en marcha, entramos en la fase que usted necesite.",
      },
      {
        q: "¿Construyen ampliaciones de bodegas en operación?",
        a: "Sí. Ampliamos naves y bodegas existentes, programando los trabajos por etapas y en horarios que no detengan su logística.",
      },
      {
        q: "¿Qué necesito para empezar?",
        a: "Con la ubicación del terreno y una idea de cómo va a operar el espacio es suficiente para la primera reunión. A partir de ahí definimos con usted el alcance, el presupuesto y el cronograma.",
      },
    ],
    related: ["estructuras-metalicas", "obra-civil", "construccion-de-edificios"],
    contactTitle: "Cotice su nave industrial.",
  },
  {
    slug: "estructuras-metalicas",
    name: "Estructuras metálicas",
    summary: "Diseño, fabricación y montaje de estructuras de acero.",
    seoTitle: "Estructuras Metálicas en Guatemala | Grupo Proinnova",
    seoDescription:
      "Diseño, fabricación y montaje de estructuras metálicas en Guatemala para naves, cubiertas, mezanines y edificios comerciales, coordinadas con la obra civil.",
    eyebrow: "Estructuras de acero · Guatemala",
    h1: "Estructuras metálicas en Guatemala: diseño, fabricación y montaje",
    lead: "Fabricamos y montamos estructuras de acero para naves, cubiertas, mezanines y edificios comerciales, coordinadas con la obra civil desde el primer plano para que todo encaje en sitio.",
    hero: { src: estructuraMetalica, alt: "Estructura metálica de cubierta en proceso de montaje" },
    heroJpg: estructuraMetalicaJpg,
    facts: [
      { label: "Aplicaciones", value: "Naves, cubiertas y mezanines" },
      { label: "Servicio", value: "Diseño, fabricación y montaje" },
      { label: "Integración", value: "Con obra civil e instalaciones" },
    ],
    intro: {
      title: "El acero permite construir más rápido. Si se planifica bien.",
      paragraphs: [
        "La estructura metálica es la forma más eficiente de cubrir grandes claros y acelerar una obra: mientras se prepara la cimentación, las piezas ya se están fabricando. La condición es que el diseño, la fabricación y el montaje hablen el mismo idioma que la obra civil. Cuando no es así aparecen placas que no coinciden, perforaciones en campo y semanas perdidas.",
        "Por eso coordinamos la estructura con las cimentaciones, la cubierta y las instalaciones desde los planos. Así cada columna llega a su placa de anclaje, cada viga tiene resuelto el paso de las instalaciones y el montaje avanza sin improvisar.",
        "Trabajamos estructuras para naves industriales y bodegas, cubiertas y techos de grandes claros, mezanines y entrepisos, marquesinas, edificios comerciales y ampliaciones sobre estructuras existentes.",
      ],
    },
    scope: {
      title: "Del plano estructural al último perno",
      items: [
        { title: "Diseño estructural", desc: "Cálculo y planos de la estructura según el uso, las cargas y el terreno de su proyecto." },
        { title: "Fabricación", desc: "Corte, armado y soldadura de columnas, vigas, armaduras y costaneras." },
        { title: "Protección anticorrosiva", desc: "Preparación de superficies y sistemas de pintura adecuados al ambiente de cada obra." },
        { title: "Montaje en sitio", desc: "Izaje y montaje con el equipo adecuado y protocolos de seguridad industrial." },
        { title: "Cubiertas y cerramientos", desc: "Lámina, panel termoacústico, tragaluces, canales y bajadas pluviales." },
        { title: "Mezanines y entrepisos", desc: "Entrepisos metálicos para ganar área útil sin construir un edificio nuevo." },
      ],
    },
    gallery: {
      title: "Acero en obra",
      photos: [
        { src: naveTragaluces, alt: "Cubierta metálica con tragaluces en nave industrial" },
        { src: edificioComercial, alt: "Edificio comercial con estructura de acero y concreto en obra gris" },
        { src: plantaIndustrial, alt: "Estructura de techo metálico en planta industrial" },
      ],
    },
    faqs: [
      {
        q: "¿Qué conviene más, estructura metálica o de concreto?",
        a: "Depende del claro a cubrir, del uso, de los plazos y del presupuesto. El acero suele ser más rápido y eficiente para grandes claros y cubiertas; el concreto, para edificios de varios niveles y cargas altas. Muchas obras combinan ambos, y lo definimos con usted en la etapa de diseño.",
      },
      {
        q: "¿Hacen solo el montaje o también el diseño?",
        a: "Hacemos ambos. Podemos diseñar, fabricar y montar la estructura completa, o trabajar sobre un diseño estructural que usted ya tenga.",
      },
      {
        q: "¿Pueden ampliar una estructura existente?",
        a: "Sí. Revisamos la estructura actual y diseñamos la ampliación para que trabaje junto con lo que ya está construido.",
      },
      {
        q: "¿Cómo se presupuesta una estructura metálica?",
        a: "Por el peso y el tipo de los perfiles, la cubierta y la complejidad del montaje. Entregamos un presupuesto desglosado después de revisar los planos o visitar el sitio.",
      },
    ],
    related: ["naves-industriales", "locales-comerciales", "construccion-de-edificios"],
    contactTitle: "Cotice su estructura metálica.",
  },
  {
    slug: "remodelaciones",
    name: "Remodelaciones",
    summary: "Remodelación de oficinas, recepciones, showrooms y locales.",
    seoTitle: "Remodelación de Oficinas y Locales en Guatemala | Proinnova",
    seoDescription:
      "Remodelación de oficinas, recepciones, showrooms y locales en Guatemala: diseño, tablayeso, instalaciones y acabados, por etapas y sin detener su operación.",
    eyebrow: "Remodelaciones · Guatemala",
    h1: "Remodelación de oficinas, locales y espacios corporativos en Guatemala",
    lead: "Transformamos oficinas, recepciones, showrooms y locales existentes en espacios modernos y funcionales, con una obra planificada para no detener su operación.",
    hero: { src: oficinaTablayeso, alt: "Remodelación de oficina con divisiones de tablayeso e iluminación indirecta" },
    heroJpg: oficinaTablayesoJpg,
    facts: [
      { label: "Espacios", value: "Oficinas, showrooms y locales" },
      { label: "Horario", value: "Trabajo nocturno o por etapas" },
      { label: "Incluye", value: "Diseño, obra y acabados" },
    ],
    intro: {
      title: "Remodelar sin detener su negocio.",
      paragraphs: [
        "Una remodelación es más delicada que una obra nueva: se trabaja dentro de un espacio que ya tiene instalaciones, vecinos, clientes y colaboradores. El reto no es solo que quede bien, sino lograrlo en el plazo acordado y sin interrumpir lo que ya funciona.",
        "Por eso planificamos cada remodelación por etapas y, cuando su operación lo requiere, trabajamos en horario nocturno o de fin de semana. Un solo equipo se encarga del diseño, las demoliciones, las instalaciones, el tablayeso, la iluminación y los acabados, con un solo interlocutor que responde por todo.",
        "Remodelamos oficinas corporativas, recepciones, salas de juntas, showrooms, locales comerciales y áreas de atención al cliente, y adaptamos espacios existentes a las nuevas necesidades de su empresa.",
      ],
    },
    scope: {
      title: "Todo lo que implica renovar un espacio",
      items: [
        { title: "Diseño y distribución", desc: "Planos, distribución de áreas y selección de materiales antes de tocar una pared." },
        { title: "Demoliciones y obra gris", desc: "Retiro de muros, cielos y acabados existentes, cuidando las áreas que siguen en uso." },
        { title: "Tablayeso y cielos", desc: "Divisiones, cielos falsos, nichos y detalles para iluminación indirecta." },
        { title: "Instalaciones", desc: "Electricidad, iluminación, datos, agua potable, drenajes y climatización." },
        { title: "Pisos y acabados", desc: "Porcelanato, vinil, madera, pintura y recubrimientos de alta gama." },
        { title: "Entrega lista para operar", desc: "Detalles finales, limpieza y entrega del espacio listo para usar." },
      ],
    },
    gallery: {
      title: "Espacios transformados",
      photos: [
        { src: showroomSala, alt: "Sala de atención a clientes remodelada con iluminación circular" },
        { src: oficinaLounge, alt: "Área lounge de oficinas corporativas con pisos de porcelanato" },
        { src: oficinaIluminacion, alt: "Oficina con cielo abierto e iluminación lineal" },
      ],
    },
    faqs: [
      {
        q: "¿Pueden remodelar mi oficina sin detener la operación?",
        a: "Sí. Planificamos la obra por etapas y, cuando hace falta, trabajamos de noche o en fin de semana para que su equipo siga trabajando.",
      },
      {
        q: "¿Cuánto cuesta remodelar una oficina en Guatemala?",
        a: "Depende del área, del estado actual del espacio, de las instalaciones que haya que cambiar y del nivel de acabados. Después de visitar el espacio le entregamos un presupuesto desglosado por actividad.",
      },
      {
        q: "¿Se encargan también del diseño?",
        a: "Sí. Podemos diseñar la distribución y los acabados, o ejecutar un diseño que usted ya tenga de su arquitecto o de su marca.",
      },
      {
        q: "¿También remodelan locales y showrooms?",
        a: "Sí. Remodelamos locales comerciales y showrooms, y coordinamos con la administración del inmueble los horarios y requisitos de la obra.",
      },
    ],
    related: ["acabados", "locales-comerciales", "diseno-arquitectonico"],
    contactTitle: "Cotice la remodelación de su espacio.",
  },
  {
    slug: "locales-comerciales",
    name: "Locales comerciales",
    summary: "Restaurantes, showrooms y locales listos para abrir.",
    seoTitle: "Construcción de Locales Comerciales en Guatemala | Proinnova",
    seoDescription:
      "Construcción y adecuación de locales comerciales, restaurantes y showrooms en Guatemala, listos para abrir en la fecha acordada y con la imagen de su marca.",
    eyebrow: "Construcción comercial · Guatemala",
    h1: "Construcción de locales comerciales, restaurantes y showrooms en Guatemala",
    lead: "Construimos y adecuamos restaurantes, showrooms y locales comerciales listos para abrir en la fecha acordada, con la imagen de su marca resuelta hasta el último detalle.",
    hero: { src: pizzaHut, alt: "Restaurante con fachada de marca en etapa final de construcción" },
    heroJpg: pizzaHutJpg,
    facts: [
      { label: "Proyectos", value: "Restaurantes, showrooms y retail" },
      { label: "Enfoque", value: "La fecha de apertura" },
      { label: "Incluye", value: "Obra, instalaciones e imagen" },
    ],
    intro: {
      title: "En un local comercial, la fecha de apertura lo es todo.",
      paragraphs: [
        "Cada día que un local no abre es venta perdida y renta pagada. Por eso en construcción comercial trabajamos contra una fecha de apertura: definimos el alcance con su equipo, programamos las especialidades en paralelo y cuidamos que la obra termine lista para operar, no solo terminada.",
        "Construimos locales desde cero o adecuamos espacios en obra gris: fachadas con la imagen de su marca, instalaciones para restaurantes, iluminación de exhibición para showrooms y acabados que reflejen el estándar que sus clientes esperan.",
        "Sirve tanto a marcas que necesitan replicar su estándar en cada punto de venta como a empresas que abren su primer local y buscan un solo responsable para toda la obra.",
      ],
    },
    scope: {
      title: "Del terreno a la gran apertura",
      items: [
        { title: "Obra gris y estructura", desc: "Cimentación, estructura, muros y losas para locales nuevos o ampliaciones." },
        { title: "Fachada e imagen de marca", desc: "Fachadas, marquesinas y elementos de imagen construidos según el manual de su marca." },
        { title: "Instalaciones", desc: "Electricidad, iluminación, agua potable, drenajes y preparación para equipos de cocina." },
        { title: "Acabados comerciales", desc: "Pisos de alto tráfico, cielos, mobiliario fijo y detalles de exhibición." },
        { title: "Parqueos y exteriores", desc: "Pavimentos, banquetas, parqueos y accesos vehiculares." },
        { title: "Entrega para apertura", desc: "Pruebas de instalaciones, limpieza y entrega lista para operar." },
      ],
    },
    gallery: {
      title: "Comercios en obra",
      photos: [
        { src: showroomAutomotriz, alt: "Showroom automotriz con iluminación lineal en el cielo" },
        { src: edificioComercial, alt: "Edificio comercial de dos niveles en obra gris" },
        { src: showroomSala, alt: "Showroom con área de atención a clientes" },
      ],
    },
    faqs: [
      {
        q: "¿Cuánto tiempo toma construir un local comercial?",
        a: "Depende del tamaño, de si se parte de cero o de un local en obra gris, y de las instalaciones que requiera su giro. Definimos el cronograma junto con usted y lo amarramos a su fecha de apertura.",
      },
      {
        q: "¿Construyen restaurantes?",
        a: "Sí. Construimos restaurantes con sus instalaciones, su fachada y su imagen de marca, listos para equipar y abrir.",
      },
      {
        q: "¿Pueden seguir el manual de construcción de una franquicia?",
        a: "Sí. Ejecutamos la obra según los lineamientos y especificaciones de la marca, y coordinamos cada revisión con su equipo de expansión.",
      },
      {
        q: "¿Qué incluye el presupuesto?",
        a: "Cada actividad desglosada: obra civil, instalaciones, acabados y exteriores. Lo que entra y lo que no queda por escrito antes de empezar.",
      },
    ],
    related: ["remodelaciones", "acabados", "estructuras-metalicas"],
    contactTitle: "Cotice su local comercial.",
  },
  {
    slug: "obra-civil",
    name: "Obra civil",
    summary: "Terracería, cimentaciones, muros de contención y drenajes.",
    seoTitle: "Obra Civil y Movimiento de Tierras en Guatemala | Proinnova",
    seoDescription:
      "Obra civil en Guatemala: movimiento de tierras, terracería, cimentaciones, muros de contención, drenajes y pavimentos, con supervisión técnica en obra.",
    eyebrow: "Obra civil · Guatemala",
    h1: "Obra civil y movimiento de tierras en Guatemala",
    lead: "Terracería, cimentaciones, muros de contención, drenajes y urbanización: la base sobre la que se levanta cualquier proyecto, ejecutada con maquinaria y supervisión técnica en cada etapa.",
    hero: { src: excavadora, alt: "Excavadora en trabajos de movimiento de tierras y muro de gaviones" },
    heroJpg: excavadoraJpg,
    facts: [
      { label: "Trabajos", value: "Terracería, muros y drenajes" },
      { label: "Etapa", value: "Antes de construir" },
      { label: "Control", value: "Supervisión técnica en obra" },
    ],
    intro: {
      title: "Lo que no se ve es lo que sostiene la obra.",
      paragraphs: [
        "La obra civil define si un proyecto se construye a tiempo y dura décadas, o si arrastra problemas desde el primer día. Un relleno mal compactado, un drenaje insuficiente o un muro sin el diseño adecuado se convierten en grietas, humedades y costos que aparecen cuando ya es tarde.",
        "Ejecutamos los trabajos de preparación e infraestructura con maquinaria, supervisión técnica y control en cada etapa: movimiento de tierras, compactación, cimentaciones, fundición de losas y muros, y las redes de drenaje que protegen la inversión.",
        "Preparamos terrenos para naves, edificios, locales y urbanizaciones, incluidos terrenos con pendiente que requieren muros de contención o gaviones.",
      ],
    },
    scope: {
      title: "Infraestructura que perdura",
      items: [
        { title: "Terracería", desc: "Corte, relleno, conformación y compactación de plataformas." },
        { title: "Cimentaciones", desc: "Zapatas, cimientos corridos, vigas y losas de cimentación." },
        { title: "Muros de contención", desc: "Muros de concreto, block o gaviones para estabilizar taludes y terrenos con pendiente." },
        { title: "Drenajes", desc: "Redes pluviales y sanitarias, zanjeo y pozos de visita." },
        { title: "Fundición de concreto", desc: "Losas, columnas y elementos estructurales fundidos en sitio." },
        { title: "Pavimentos y urbanización", desc: "Calles, parqueos, banquetas y obras exteriores." },
      ],
    },
    gallery: {
      title: "Obra civil en ejecución",
      photos: [
        { src: muroGaviones, alt: "Muro de contención de gaviones junto a un canal" },
        { src: obrerosColado, alt: "Cuadrilla fundiendo losa con supervisión técnica" },
        { src: gruaColado, alt: "Fundición de concreto con bomba pluma al atardecer" },
      ],
    },
    faqs: [
      {
        q: "¿Qué incluye el movimiento de tierras?",
        a: "Corte, relleno, acarreo y compactación del terreno hasta dejar la plataforma al nivel del proyecto, lista para cimentar.",
      },
      {
        q: "¿Construyen muros de contención?",
        a: "Sí. De concreto, block o gaviones, según la altura, el tipo de suelo y el uso del terreno.",
      },
      {
        q: "¿Hacen solo la obra civil o el proyecto completo?",
        a: "Ambos. Podemos ejecutar solo la obra civil de su proyecto o continuar con la estructura, las instalaciones y los acabados bajo el mismo contrato.",
      },
      {
        q: "¿Cómo se define el presupuesto de obra civil?",
        a: "Por volúmenes de corte y relleno, metros de muro y de drenaje y metros cúbicos de concreto, todo desglosado para que sepa exactamente qué está pagando.",
      },
    ],
    related: ["construccion-de-edificios", "naves-industriales", "estructuras-metalicas"],
    contactTitle: "Cotice la obra civil de su proyecto.",
  },
  {
    slug: "construccion-de-edificios",
    name: "Construcción de edificios",
    summary: "Contratista general de edificios, llave en mano.",
    seoTitle: "Construcción de Edificios en Guatemala | Grupo Proinnova",
    seoDescription:
      "Contratista general en Guatemala: construimos edificios comerciales, corporativos y residenciales llave en mano, con un solo responsable de principio a fin.",
    eyebrow: "Contratista general · Guatemala",
    h1: "Construcción de edificios llave en mano en Guatemala",
    lead: "Como contratista general coordinamos diseño, obra civil, estructura, instalaciones y acabados de edificios comerciales, corporativos y residenciales bajo un solo responsable, de la idea a la entrega.",
    hero: { src: estructuraConcreto, alt: "Estructura de concreto de un edificio de varios niveles en construcción" },
    heroJpg: estructuraConcretoJpg,
    facts: [
      { label: "Edificios", value: "Comerciales, corporativos y residenciales" },
      { label: "Rol", value: "Contratista general" },
      { label: "Capacidad", value: "Más de 8 obras en simultáneo" },
    ],
    intro: {
      title: "Un edificio, un responsable.",
      paragraphs: [
        "Cuando un edificio se contrata por partes, cada proveedor responde solo por lo suyo y los problemas quedan en medio: entre el diseño y la estructura, entre la estructura y las instalaciones. Como contratista general asumimos el proyecto completo y respondemos por el resultado final.",
        "Coordinamos arquitectura, estructura, instalaciones hidrosanitarias, eléctricas y climatización desde el primer plano, y ejecutamos la obra con supervisión técnica, control de calidad y un cronograma que se cumple. Usted tiene un solo interlocutor durante todo el proyecto.",
        "Construimos edificios de oficinas, comerciales y de uso mixto, torres residenciales y proyectos de varios niveles, llave en mano o entrando en la fase en que se encuentre su proyecto.",
      ],
    },
    scope: {
      title: "Todo el edificio, bajo un mismo contrato",
      items: [
        { title: "Diseño e ingeniería", desc: "Arquitectura, cálculo estructural e ingenierías coordinadas desde el inicio." },
        { title: "Obra gris", desc: "Cimentación, estructura de concreto o acero, muros y losas, nivel por nivel." },
        { title: "Instalaciones", desc: "Hidrosanitarias, eléctricas, especiales y climatización integradas al diseño." },
        { title: "Fachadas y acabados", desc: "Cerramientos, ventanería, pisos, cielos y acabados de alta gama." },
        { title: "Project management", desc: "Control de tiempo, costo y calidad con reportes claros para el propietario." },
        { title: "Entrega y seguimiento", desc: "Entrega final, garantía y seguimiento después de la obra." },
      ],
    },
    gallery: {
      title: "Edificios en obra",
      photos: [
        { src: torreResidencial, alt: "Torre residencial de varios niveles terminada" },
        { src: edificioAndamios, alt: "Edificio en ejecución con andamios y malla de seguridad" },
        { src: interiorObraGris, alt: "Interior de edificio en obra gris con ventanales" },
      ],
    },
    faqs: [
      {
        q: "¿Qué significa construir llave en mano?",
        a: "Que un solo contratista se encarga de todo el proyecto, desde el diseño y los permisos hasta la entrega, y usted recibe el edificio terminado y listo para usar.",
      },
      {
        q: "¿Qué hace un contratista general?",
        a: "Coordina y ejecuta todas las especialidades de la obra —obra civil, estructura, instalaciones y acabados— y responde ante el propietario por el tiempo, el costo y la calidad del proyecto completo.",
      },
      {
        q: "¿Pueden continuar una obra que ya empezó otra empresa?",
        a: "Sí. Revisamos el estado de la obra, la documentación y lo ejecutado, y definimos con usted cómo continuar.",
      },
      {
        q: "¿Cuántos proyectos manejan a la vez?",
        a: "Tenemos capacidad para sostener más de ocho obras en simultáneo, cada una con su propia supervisión.",
      },
    ],
    related: ["obra-civil", "diseno-arquitectonico", "acabados"],
    contactTitle: "Hablemos de su edificio.",
  },
  {
    slug: "acabados",
    name: "Acabados",
    summary: "Pisos, muros, cielos, iluminación y detalles de alta gama.",
    seoTitle: "Acabados de Construcción en Guatemala | Grupo Proinnova",
    seoDescription:
      "Acabados de construcción de alta gama en Guatemala: pisos, tablayeso, cielos, iluminación, recubrimientos y carpintería para oficinas, comercios y residencias.",
    eyebrow: "Acabados · Guatemala",
    h1: "Acabados de construcción de alta gama en Guatemala",
    lead: "Pisos, muros, cielos, iluminación y detalles que definen cómo se percibe un espacio. Ejecutamos acabados de alta gama para oficinas, comercios y residencias, con precisión de obra fina.",
    hero: { src: recepcion, alt: "Recepción corporativa con acabados de piedra, madera e iluminación indirecta" },
    heroJpg: recepcionJpg,
    facts: [
      { label: "Espacios", value: "Corporativos, comerciales y residenciales" },
      { label: "Materiales", value: "Porcelanato, madera, piedra y más" },
      { label: "Etapa", value: "Obra nueva o remodelación" },
    ],
    intro: {
      title: "El detalle es lo que su cliente ve.",
      paragraphs: [
        "La estructura sostiene un edificio, pero los acabados son lo que sus clientes, colaboradores y visitantes perciben cada día. Una junta desalineada, un cielo con ondulaciones o una iluminación mal resuelta bastan para que un espacio costoso se vea descuidado.",
        "Ejecutamos los acabados con el mismo rigor que la obra gris: materiales definidos con usted antes de instalar, mano de obra calificada y supervisión en cada etapa, hasta la limpieza final.",
        "Instalamos pisos de porcelanato, vinil y madera, recubrimientos de muros, tablayeso y cielos falsos, iluminación decorativa, carpintería y detalles especiales para recepciones, oficinas, showrooms y residencias.",
      ],
    },
    scope: {
      title: "Cada superficie, bien resuelta",
      items: [
        { title: "Pisos", desc: "Porcelanato, vinil, madera, concreto pulido y piedra, con nivelación y juntas precisas." },
        { title: "Muros y recubrimientos", desc: "Pintura, enchapes, paneles y revestimientos decorativos." },
        { title: "Tablayeso y cielos", desc: "Cielos falsos, divisiones, nichos y detalles para iluminación indirecta." },
        { title: "Iluminación", desc: "Iluminación lineal, indirecta y decorativa integrada a la arquitectura." },
        { title: "Carpintería y detalles", desc: "Mostradores, puertas, closets y elementos de madera a la medida." },
        { title: "Fachadas", desc: "Revestimientos, celosías y elementos de fachada de alta gama." },
      ],
    },
    gallery: {
      title: "Detalles terminados",
      photos: [
        { src: residencia, alt: "Fachada residencial con celosía de madera y piedra" },
        { src: oficinaLounge, alt: "Área lounge con pisos de porcelanato y mobiliario corporativo" },
        { src: oficinaIluminacion, alt: "Oficina con iluminación lineal y acabados contemporáneos" },
      ],
    },
    faqs: [
      {
        q: "¿Pueden hacer solo los acabados de una obra?",
        a: "Sí. Podemos entrar cuando la obra gris ya está terminada y encargarnos únicamente de los acabados, o ejecutarlos como parte del proyecto completo.",
      },
      {
        q: "¿Ayudan a elegir los materiales?",
        a: "Sí. Definimos con usted los materiales según el uso, el tráfico, el mantenimiento y el presupuesto, y los dejamos por escrito antes de instalar.",
      },
      {
        q: "¿Cuánto cuestan los acabados de alta gama?",
        a: "Varían mucho según el material y el nivel de detalle. Le entregamos opciones con su presupuesto desglosado para que decida con claridad.",
      },
      {
        q: "¿Hacen acabados para residencias?",
        a: "Sí. Además de oficinas y comercios, ejecutamos acabados para residencias.",
      },
    ],
    related: ["remodelaciones", "locales-comerciales", "diseno-arquitectonico"],
    contactTitle: "Cotice los acabados de su proyecto.",
  },
  {
    slug: "diseno-arquitectonico",
    name: "Diseño arquitectónico",
    summary: "Planos constructivos, ingenierías y licencias de construcción.",
    seoTitle: "Diseño Arquitectónico y Planos en Guatemala | Proinnova",
    seoDescription:
      "Diseño arquitectónico, planos constructivos, cálculo estructural e instalaciones en Guatemala, más la gestión de la licencia de construcción.",
    eyebrow: "Diseño y planificación · Guatemala",
    h1: "Diseño arquitectónico, planos y permisos de construcción en Guatemala",
    lead: "Convertimos su idea en planos constructivos completos —arquitectura, estructura e instalaciones coordinadas desde el inicio— y gestionamos la licencia, para construir sin sorpresas.",
    hero: { src: ingenierosPlanos, alt: "Ingenieros revisando planos frente a un edificio en construcción" },
    heroJpg: ingenierosPlanosJpg,
    facts: [
      { label: "Entregables", value: "Planos constructivos completos" },
      { label: "Ingenierías", value: "Estructura e instalaciones" },
      { label: "Trámites", value: "Licencia de construcción" },
    ],
    intro: {
      title: "Cada cambio en obra empieza como un pendiente en el plano.",
      paragraphs: [
        "Buena parte de los sobrecostos de una construcción nace en planos incompletos: instalaciones que chocan con la estructura, medidas que no cuadran, acabados que nadie definió. Cada una de esas decisiones pendientes se paga después, en obra, al precio más alto.",
        "Por eso diseñamos integrando desde el primer plano la arquitectura, el cálculo estructural y las instalaciones hidrosanitarias, eléctricas y de climatización. El resultado es un proyecto que se puede presupuestar con precisión y construir sin cambios costosos.",
        "Diseñamos oficinas, locales comerciales, naves industriales, edificios y residencias, y preparamos la documentación para tramitar la licencia de construcción ante la municipalidad correspondiente.",
      ],
    },
    scope: {
      title: "Un proyecto listo para construir",
      items: [
        { title: "Anteproyecto", desc: "Distribución, volumetría y concepto validados con usted antes de desarrollar." },
        { title: "Planos arquitectónicos", desc: "Plantas, elevaciones, secciones y detalles constructivos." },
        { title: "Diseño estructural", desc: "Cálculo y planos estructurales según el uso y el terreno." },
        { title: "Instalaciones", desc: "Planos hidrosanitarios, eléctricos y de climatización coordinados con la arquitectura." },
        { title: "Presupuesto", desc: "Cuantificación desglosada por actividad a partir de los planos." },
        { title: "Licencias y permisos", desc: "Preparación de la documentación y gestión de la licencia de construcción." },
      ],
    },
    gallery: {
      title: "Del plano a la obra",
      photos: [
        { src: residencia, alt: "Residencia contemporánea con fachada de madera" },
        { src: torreResidencial, alt: "Torre residencial de varios niveles" },
        { src: interiorObraGris, alt: "Interior en obra gris listo para acabados" },
      ],
    },
    faqs: [
      {
        q: "¿Qué planos necesito para construir en Guatemala?",
        a: "Como mínimo, planos arquitectónicos, estructurales y de instalaciones, que además son la base para tramitar la licencia de construcción en la municipalidad. Los requisitos exactos varían según el municipio y el tipo de proyecto.",
      },
      {
        q: "¿Ustedes tramitan la licencia de construcción?",
        a: "Sí. Preparamos la documentación técnica y gestionamos el trámite de la licencia como parte del proyecto.",
      },
      {
        q: "¿Puedo contratar solo el diseño?",
        a: "Sí. Puede contratar solo el diseño y los planos, o continuar la construcción con el mismo equipo que diseñó.",
      },
      {
        q: "¿Por qué integrar las instalaciones desde el diseño?",
        a: "Porque es la forma de evitar choques entre tuberías, ductos y estructura, que en obra se traducen en demoliciones, retrasos y sobrecostos.",
      },
    ],
    related: ["construccion-de-edificios", "remodelaciones", "naves-industriales"],
    contactTitle: "Empecemos por el diseño.",
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicePath = (slug: string) => `/servicios/${slug}/`;

/** The hub page (/servicios/). */
export const HUB = {
  seoTitle: "Servicios de Construcción en Guatemala | Grupo Proinnova",
  seoDescription:
    "Servicios de construcción en Guatemala: naves industriales, edificios, locales, remodelaciones, obra civil, estructuras metálicas, acabados y diseño.",
  eyebrow: "Constructora en Guatemala",
  h1: "Servicios de construcción en Guatemala",
  lead: "Diseño, obra civil, estructuras, instalaciones y acabados bajo un solo contrato. Elija el tipo de proyecto y conozca qué incluye.",
  hero: { src: obrerosColado, alt: "Cuadrilla fundiendo una losa de concreto con supervisión en obra" } as Photo,
  heroJpg: obrerosColadoJpg,
  intro: [
    "Grupo Proinnova es una constructora en Guatemala que integra en un solo equipo todas las especialidades de una obra: diseño arquitectónico, obra civil, estructuras metálicas y de concreto, instalaciones hidrosanitarias y eléctricas, y acabados de alta gama.",
    "Esa integración es lo que nos permite presupuestar con precisión, cumplir las fechas y responder por el resultado completo. Hemos entregado más de 50 proyectos y tenemos capacidad para sostener más de ocho obras en simultáneo.",
  ],
  more: "También ejecutamos instalaciones hidrosanitarias y eléctricas, movimientos de tierra y project management como parte de cada proyecto.",
};
