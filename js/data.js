/* Todos los números de la presentación (Sección 6 del guion). No se recalculan. */
window.DATA = {
  general: {
    registros: 11966, noLeen: 281, alfabetos: 11685,
    anios: [2019, 2020, 2021, 2022, 2023, 2024],
    registrosPorAnio: [1980, 2010, 1948, 2016, 1996, 2016],
    pctLectores: 41.7, lectores: 4868,
    librosMedia: 3.53, librosMediana: 2, librosMax: 99, sesgo: 7.29,
    inegi: { y2015: 84.2, y2024: 69.6 },
    gallupUS: 12.6,
    alpha: 0.04, zFrontera: 2.054,
  },

  // 6.2 Lectores por nivel de acceso (IC 96 %)
  niveles: {
    hogar: [
      { nivel: "Bajo", rango: "0–1", n: 5207, p: 0.2806, li: 0.2678, ls: 0.2933 },
      { nivel: "Medio", rango: "2", n: 1837, p: 0.4633, li: 0.4394, ls: 0.4872 },
      { nivel: "Alto", rango: "3–4", n: 3983, p: 0.5973, li: 0.5813, ls: 0.6133 },
    ],
    escuela: [
      { nivel: "Bajo", rango: "0–1", n: 2749, p: 0.3027, li: 0.2847, ls: 0.3207 },
      { nivel: "Medio", rango: "2", n: 1554, p: 0.3526, li: 0.3277, ls: 0.3775 },
      { nivel: "Alto", rango: "3–4", n: 6524, p: 0.4870, li: 0.4743, ls: 0.4997 },
    ],
  },

  // Distribución de los índices (% de personas con 0–4 estímulos)
  distribucion: {
    hogar: [29.0, 18.2, 16.7, 18.5, 17.6],
    escuela: [14.8, 10.6, 14.4, 16.3, 43.9],
  },

  // 6.3 Hogar vs escuela
  soloEscuela: { x: 533, n: 1977, p: 0.2696 },
  soloHogar: { x: 232, n: 500, p: 0.4640 },
  // IC 96 % de (escuela − hogar); z ≈ 8.41
  difEscuelaHogar: { li: -0.2458, ls: -0.1430, z: 8.41 },
  // Barras de error de cada grupo en la gráfica de R (IC 96 % de una proporción).
  // No vienen en la Sección 6: son p ± 2.054·√(p(1−p)/n), como en la gráfica del reporte.
  icGrupos: {
    soloEscuela: [0.2491, 0.2901],
    soloHogar: [0.4182, 0.5098],
  },

  pruebasNiveles: {
    hogar: [
      { comp: "Bajo–Medio", p1: 0.2806, p2: 0.4633, dif: 0.1827, frontera: 0.0262, z: 14.34 },
      { comp: "Medio–Alto", p1: 0.4633, p2: 0.5973, dif: 0.1340, frontera: 0.0288, z: 9.56 },
      { comp: "Bajo–Alto", p1: 0.2806, p2: 0.5973, dif: 0.3167, frontera: 0.0213, z: 30.50 },
    ],
    escuela: [
      { comp: "Bajo–Medio", p1: 0.3027, p2: 0.3526, dif: 0.0500, frontera: 0.0304, z: 3.37 },
      { comp: "Medio–Alto", p1: 0.3526, p2: 0.4870, dif: 0.1343, frontera: 0.0289, z: 9.55 },
      { comp: "Bajo–Alto", p1: 0.3027, p2: 0.4870, dif: 0.1843, frontera: 0.0231, z: 16.36 },
    ],
  },

  // Personas con acceso bajo en casa: escuela alta − escuela baja
  compensacion: { dif: 0.0778, li: 0.0508, ls: 0.1049 },

  // 6.4 Escolaridad
  escolaridad: [
    { nivel: "Primaria o menos", pct: 24.7, n: 2021 },
    { nivel: "Secundaria", pct: 26.6, n: 2863 },
    { nivel: "Media superior", pct: 40.9, n: 3266 },
    { nivel: "Superior", pct: 64.5, n: 3511 },
  ],
  escolaridadPruebas: [
    { comp: "Primaria → Secundaria", dif: 0.0188, z: 1.47, p: 0.140, li: -0.0073, ls: 0.0448, sig: false },
    { comp: "Secundaria → Media superior", dif: 0.1429, z: 11.76, li: 0.1184, ls: 0.1674, sig: true },
    { comp: "Media superior → Superior", dif: 0.2363, z: 19.48, li: 0.2121, ls: 0.2606, sig: true },
  ],
  icSuperiorPrimaria: [0.3690, 0.4224],
  escolaridadAcceso: [
    { nivel: "Primaria o menos", v: [21.8, 35.1, 40.9] },
    { nivel: "Secundaria", v: [21.1, 30.3, 41.0] },
    { nivel: "Media superior", v: [28.8, 45.4, 52.3] },
    { nivel: "Superior", v: [49.4, 63.0, 73.4] },
  ],

  // 6.5 Cantidad de libros (solo lectores)
  mediasHogar: { alto: 3.85, bajo: 3.07, li: 0.4279, ls: 1.1285 },
  librosEnCasa: [
    { cat: "Ninguno", n: 1205, media: 2.89, mediana: 2, sd: 4.72, q1: 1, q3: 3 },
    { cat: "1–25", n: 1851, media: 3.01, mediana: 2, sd: 4.30, q1: 1, q3: 3 },
    { cat: "26–50", n: 822, media: 3.48, mediana: 3, sd: 3.78, q1: 2, q3: 4 },
    { cat: "51–75", n: 322, media: 4.29, mediana: 3, sd: 5.03, q1: 2, q3: 5 },
    { cat: "76–100", n: 215, media: 4.89, mediana: 3, sd: 6.95, q1: 2, q3: 5 },
    { cat: "Más de 100", n: 342, media: 7.29, mediana: 4, sd: 10.72, q1: 2, q3: 8 },
  ],

  // Intervalo de la varianza de libros leídos, grupo "Más de 100" (reporte de la Etapa 3)
  varianzaMas100: { n: 335, gl: 334, s2: 116.91, li: 100.32, ls: 137.93 },

  // 6.6 Ji-cuadrada hogar × escuela (filas: hogar 0–4; columnas: escuela 0–4)
  contingencia: [
    [993, 477, 509, 362, 629],
    [233, 256, 349, 360, 696],
    [138, 194, 272, 339, 797],
    [89, 120, 230, 407, 1080],
    [40, 56, 119, 249, 1390],
  ],
  totalesFila: [2970, 1894, 1740, 1926, 1854],
  totalesColumna: [1493, 1103, 1479, 1717, 4592],
  totalTabla: 10384,
  chi: { x2: 2414.77, gl: 16, frontera: 27.14, minEsperada: 184.8 },
  destacados: { h0e0: 33.4, h4e0: 2.2, h4e4: 75.0, h0e4: 21.2 },

};
