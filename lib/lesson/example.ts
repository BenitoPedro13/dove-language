import type { Lesson } from "./schema"

/**
 * A real Dove session, transcribed from docs/refs/portuguese-session-a1-a2-social-media-2026.pdf
 * (research §2). Content is the teacher's; only factual language errors were fixed (research
 * §2.2 #7): es "usuario", "comentario", "dar me gusta", "Similar a jajaja". Translations the
 * original didn't have are left empty rather than invented. The meme/Orkut screenshots are not
 * included (we don't have the image files), so those slides are omitted.
 *
 * Ids are fixed so /brand renders identically on the server every time.
 */
const pt = "pt-BR"

export const EXAMPLE_LESSON: Lesson = {
  version: 1,
  id: "example-pt-social-media",
  updatedAt: "2026-08-25T08:24:35.000Z",
  target: pt,
  glosses: ["en", "es"],
  level: "A1–A2",
  title: {
    [pt]: "Redes sociais e internet",
    en: "Social media & the internet",
    es: "",
  },
  session: { number: null, date: "", host: "" },
  theme: "paper",
  blocks: [
    {
      id: "b-objectives",
      type: "objectives",
      heading: { [pt]: "Objetivos da aula", en: "Lesson objectives", es: "" },
      topic: { [pt]: "Redes sociais e internet", en: "Social media & the internet", es: "" },
      text: {
        [pt]: "Nesta aula, vamos aprender vocabulário relacionado às redes sociais e à internet, além de algumas gírias e abreviações usadas por brasileiros online.",
        en: "In this lesson, we will learn vocabulary related to social media and the internet, as well as some slang and abbreviations used by Brazilians online.",
        es: "",
      },
    },
    {
      id: "b-intro",
      type: "prompt",
      heading: { [pt]: "Introdução", en: "Introduction", es: "" },
      question: {
        [pt]: "Como os brasileiros usam a internet e as redes sociais?",
        en: "How do Brazilians use the internet and social media?",
        es: "",
      },
      detail: {
        [pt]: "Do vocabulário básico às gírias digitais nos dias de hoje.",
        en: "From basic vocabulary to digital slang in today’s world.",
        es: "",
      },
    },
    {
      id: "b-note",
      type: "note",
      heading: { [pt]: "Nota cultural", en: "Cultural note", es: "" },
      text: {
        [pt]: "A linguagem da internet muda muito rápido. Em 2026, TikTok, Instagram e vídeos curtos continuam tendo grande influência na forma como muitos brasileiros se comunicam, e várias gírias vêm do inglês e são adaptadas ao português.",
        en: "Internet language changes very quickly. In 2026, TikTok, Instagram, and short-form videos continue to have a major influence on how many Brazilians communicate, and many slang terms come from English and are adapted into Portuguese.",
        es: "",
      },
    },
    {
      id: "b-vocab",
      type: "vocabulary",
      heading: { [pt]: "Vocabulário básico", en: "Basic vocabulary", es: "" },
      items: [
        ["v1", "Internet", "internet", "internet"],
        ["v2", "Rede social", "social media / social network", "red social"],
        ["v3", "Aplicativo", "app", "aplicación"],
        ["v4", "Celular", "cellphone / phone", "celular"],
        ["v5", "Computador", "computer", "computadora"],
        ["v6", "Perfil", "profile", "perfil"],
        ["v7", "Conta", "account", "cuenta"],
        ["v8", "Usuário", "user", "usuario"],
        ["v9", "Postagem / Post", "post", "publicación"],
        ["v10", "Comentário", "comment", "comentario"],
        ["v11", "Curtida / Like", "like", "me gusta"],
        ["v12", "Seguidor(a)", "follower", "seguidor(a)"],
        ["v13", "Conteúdo", "content", "contenido"],
        ["v14", "Vídeo", "video", "video"],
        ["v15", "Hashtag", "hashtag", "hashtag"],
        ["v16", "Meme", "meme", "meme"],
      ].map(([id, term, en, es]) => ({ id, term, glosses: { en, es }, note: "" })),
    },
    {
      id: "b-examples",
      type: "examples",
      heading: { [pt]: "Exemplos", en: "Examples", es: "" },
      items: [
        {
          id: "e1",
          text: "Eu vi um vídeo engraçado no TikTok.",
          glosses: { en: "I saw a funny video on TikTok.", es: "Vi un video divertido en TikTok." },
        },
        {
          id: "e2",
          text: "Ela postou uma foto no Instagram.",
          glosses: { en: "She posted a photo on Instagram.", es: "Ella publicó una foto en Instagram." },
        },
        {
          id: "e3",
          text: "Quantos seguidores você tem?",
          glosses: { en: "How many followers do you have?", es: "¿Cuántos seguidores tienes?" },
        },
      ],
    },
    {
      id: "b-verbs",
      type: "vocabulary",
      heading: { [pt]: "Verbos da internet", en: "Internet verbs", es: "" },
      items: [
        ["w1", "Postar", "to post", "publicar", ""],
        ["w2", "Curtir", "to like", "dar me gusta", ""],
        ["w3", "Comentar", "to comment", "comentar", ""],
        ["w4", "Compartilhar", "to share", "compartir", ""],
        ["w5", "Seguir", "to follow", "seguir", ""],
        ["w6", "Bloquear", "to block", "bloquear", ""],
        ["w7", "Marcar / Mencionar / Pingar", "to tag", "etiquetar", "pingar: Discord"],
        ["w8", "Clicar", "to click", "hacer clic", ""],
        ["w9", "Baixar", "to download", "descargar", ""],
        ["w10", "Enviar", "to send", "enviar", ""],
        ["w11", "Apagar", "to delete", "borrar", ""],
        ["w12", "Pesquisar", "to search", "buscar", ""],
        ["w13", "Rolar / Scrollar", "to scroll", "deslizar", ""],
        ["w14", "Viralizar", "to go viral", "hacerse viral", ""],
      ].map(([id, term, en, es, note]) => ({ id, term, glosses: { en, es }, note })),
    },
    {
      id: "b-verbs-examples",
      type: "examples",
      heading: { [pt]: "Exemplos", en: "Examples", es: "" },
      items: [
        {
          id: "x1",
          text: "Vou compartilhar esse vídeo.",
          glosses: { en: "I'm going to share this video.", es: "Voy a compartir este video." },
        },
        {
          id: "x2",
          text: "Ela curtiu minha postagem.",
          glosses: { en: "She liked my post.", es: "Le dio “me gusta” a mi publicación." },
        },
        {
          id: "x3",
          text: "Esse vídeo viralizou muito rápido.",
          glosses: { en: "This video went viral very quickly.", es: "Este video se hizo viral muy rápido." },
        },
      ],
    },
    {
      id: "b-timeline-2000",
      type: "textImage",
      heading: {
        [pt]: "Uma pequena cronologia da internet brasileira",
        en: "A short timeline of Brazilian internet culture",
        es: "",
      },
      subheading: { [pt]: "Anos 2000 — Blogs, fóruns e Orkut", en: "2000s — Blogs, forums, and Orkut", es: "" },
      text: {
        [pt]: "No começo da internet social no Brasil, blogs, fóruns e o Orkut eram muito populares. As pessoas escreviam textos, compartilhavam fotos e participavam de comunidades.",
        en: "In the early days of Brazilian social internet culture, blogs, forums, and Orkut were very popular. People wrote posts, shared photos, and joined communities.",
        es: "",
      },
      image: null,
      imageSide: "end",
    },
    {
      id: "b-timeline-2010",
      type: "textImage",
      heading: {
        [pt]: "Uma pequena cronologia da internet brasileira",
        en: "A short timeline of Brazilian internet culture",
        es: "",
      },
      subheading: {
        [pt]: "Anos 2010 — Facebook, Instagram e WhatsApp",
        en: "2010s — Facebook, Instagram, and WhatsApp",
        es: "",
      },
      text: {
        [pt]: "As redes sociais ficaram ainda mais populares. Facebook, Instagram e WhatsApp passaram a fazer parte da comunicação cotidiana.",
        en: "Social media became even more popular. Facebook, Instagram, and WhatsApp became part of everyday communication.",
        es: "",
      },
      image: null,
      imageSide: "start",
    },
    {
      id: "b-laugh",
      type: "spotlight",
      heading: { [pt]: "Como os brasileiros riem online?", en: "How do Brazilians laugh online?", es: "" },
      term: "kkkkkkkk",
      meaning: { en: "Similar to hahahaha / lol", es: "Similar a jajajaja" },
      example: "Isso foi muito engraçado kkkkk.",
      exampleGlosses: { en: "That was so funny lol.", es: "Eso fue muy gracioso jajaja." },
      note: {
        [pt]: "Uma das características mais famosas do português brasileiro na internet.",
        en: "",
        es: "",
      },
    },
    {
      id: "b-abbr",
      type: "abbreviations",
      heading: { [pt]: "Outras gírias online brasileiras", en: "Other Brazilian online slang", es: "" },
      items: [
        { id: "a1", short: "kkkk", full: "", meaning: { en: "haha / lol" } },
        { id: "a2", short: "rsrs", full: "", meaning: { en: "hehe / haha (sometimes used for flirting)" } },
        { id: "a3", short: "mds", full: "meu Deus", meaning: { en: "OMG" } },
        { id: "a4", short: "vc", full: "você", meaning: { en: "you" } },
        { id: "a5", short: "tb / tbm", full: "também", meaning: { en: "also / too" } },
        { id: "a6", short: "pq", full: "porque / por quê", meaning: { en: "because / why" } },
      ],
    },
    {
      id: "b-hitar",
      type: "spotlight",
      heading: {
        [pt]: "Gírias da internet atualmente no Brasil",
        en: "Current slang on the internet in Brazil",
        es: "",
      },
      term: "Hitar",
      meaning: { en: "To become successful / go viral" },
      example: "Essa música hitou muito!",
      exampleGlosses: { en: "This song became a huge hit!", es: "¡Esta canción fue un gran éxito!" },
      note: {},
    },
    {
      id: "b-tankar",
      type: "spotlight",
      heading: {
        [pt]: "Gírias da internet atualmente no Brasil",
        en: "Current slang on the internet in Brazil",
        es: "",
      },
      term: "Tankar",
      meaning: { en: "To handle / withstand something (negative or ironic)" },
      example: "Eu não tanquei esse vídeo.",
      exampleGlosses: { en: "I couldn't handle this video.", es: "No pude soportar este video." },
      note: {},
    },
    {
      id: "b-aura",
      type: "spotlight",
      heading: {
        [pt]: "Gírias da internet atualmente no Brasil",
        en: "Current slang on the internet in Brazil",
        es: "",
      },
      term: "Farmar aura",
      meaning: { en: "Gaining “aura”: social coolness or impressive points." },
      example: "Ele está farmando aura nesse vídeo.",
      exampleGlosses: { en: "He's farming aura in this video.", es: "Está ganando “aura” en este video." },
      note: {
        en: "These terms are associated with the language young people use today; some are very short-lived.",
      },
    },
    {
      id: "b-english",
      type: "vocabulary",
      heading: { [pt]: "Palavras que vêm do inglês", en: "Words that come from English", es: "" },
      items: [
        ["g1", "Flopar", "flop", "fracasar"],
        ["g2", "Hitar", "hit", "triunfar / hacerse éxito"],
        ["g3", "Stalkear", "to check profile", "revisar perfil"],
        ["g4", "Shippar", "ship", "emparejar"],
        ["g5", "Tankar", "tank", "aguantar"],
        ["g6", "Postar", "post", "publicar"],
        ["g7", "Printar", "screenshot", "hacer captura"],
        ["g8", "Streamar", "stream", "reproducir / hacer streaming"],
      ].map(([id, term, en, es]) => ({ id, term, glosses: { en, es }, note: "" })),
    },
    {
      id: "b-break",
      type: "break",
      title: { [pt]: "Hora dos exercícios", en: "Exercise time", es: "" },
    },
    {
      id: "b-fill",
      type: "fillBlank",
      heading: { [pt]: "Complete as frases", en: "Complete the sentences", es: "" },
      instructions: { [pt]: "Use as palavras abaixo.", en: "Use the words below.", es: "" },
      items: [
        { id: "f1", sentence: "Eu vou [postar/curtir/compartilhar] uma foto hoje." },
        { id: "f2", sentence: "Ela tem muitos [seguidores] no Instagram." },
        { id: "f3", sentence: "Você pode [postar/curtir/compartilhar] meu vídeo?" },
        { id: "f4", sentence: "Esse meme [viralizou] ontem." },
        { id: "f5", sentence: "Eu adoro [postar/compartilhar] vídeos engraçados." },
      ],
      wordBank: "postar, curtir, compartilhar, seguidores, viralizou",
      showAnswerKey: true,
    },
    {
      id: "b-dialogue",
      type: "dialogue",
      heading: { [pt]: "Diálogo", en: "Dialogue", es: "Diálogo" },
      scene: {
        [pt]: "Instagram — uma postagem nova",
        en: "Instagram — a new post",
        es: "Instagram — una publicación nueva",
      },
      lines: [
        ["d1", "Ana", "Oi, Leo! Você viu meu post novo no Instagram?", "Hi, Leo! Did you see my new Instagram post?", "¡Hola, Leo! ¿Viste mi nueva publicación en Instagram?"],
        ["d2", "Leo", "Vi sim! Ficou muito bom, kkkkk. As fotos ficaram lindas.", "I did! It turned out really good, lol. The photos look beautiful.", "¡Sí! Quedó muy buena, jajaja. Las fotos están lindas."],
        ["d3", "Ana", "Sério? Eu fiquei com vergonha de postar. Demorei quase uma hora para escolher a foto.", "Really? I was embarrassed to post it. It took me almost an hour to choose the photo.", "¿En serio? Me daba vergüenza publicarla. Tardé casi una hora en elegir la foto."],
        ["d4", "Leo", "Para! Você arrasou. Já tem muitas curtidas?", "Come on! You did great. Does it already have a lot of likes?", "¡Vamos! Lo hiciste genial. ¿Ya tiene muchos “me gusta”?"],
        ["d5", "Ana", "Já! Tem quase 2 mil curtidas.", "Yes! Almost 2,000 likes.", "¡Sí! Casi 2.000 “me gusta”."],
        ["d6", "Leo", "Mds! Em poucas horas?", "OMG! In just a few hours?", "¡Dios mío! ¿En solo unas horas?"],
        ["d7", "Ana", "Sim! Eu não esperava. Algumas pessoas também começaram a compartilhar.", "Yes! I didn't expect it. Some people also started sharing it.", "¡Sí! No me lo esperaba. Algunas personas también empezaron a compartirla."],
        ["d8", "Leo", "Então talvez o post viralize!", "Then maybe the post will go viral!", "¡Entonces quizás se haga viral!"],
        ["d9", "Ana", "Tomara! Quero muito que mais pessoas vejam.", "Hopefully! I really want more people to see it.", "¡Ojalá! Quiero mucho que más personas la vean."],
        ["d10", "Leo", "Relaxa. O algoritmo parece estar ajudando você hoje, kkkkk.", "Don't worry. The algorithm seems to be helping you today, lol.", "Tranquila. Parece que el algoritmo te está ayudando hoy, jajaja."],
      ].map(([id, speaker, text, en, es]) => ({ id, speaker, text, glosses: { en, es } })),
    },
    {
      id: "b-closing",
      type: "closing",
      title: { [pt]: "Obrigado(a)!", en: "Thank you!", es: "" },
      message: { [pt]: "Até a próxima sessão.", en: "See you at the next session.", es: "" },
      nextSteps:
        "Download this lesson in #lesson-resources\nQuestions? Ask in #teacher-student-chat\nNext sessions: #lesson-calendar",
    },
  ],
}
