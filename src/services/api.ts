import { HomeVideo } from '../types/video';

const API_BASE_URL = 'https://lucasfiiresearch.com.br'; // URL do seu site
const USE_MOCK_DATA = false; // true = dados mockados | false = API real

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Dados mockados para desenvolvimento
const MOCK_VIDEOS: HomeVideo[] = [
  {
    _id: '1',
    title: 'Análise Completa do Mercado de FIIs',
    description: 'Entenda como funciona o mercado de fundos imobiliários e as melhores estratégias de investimento para 2024.',
    videoId: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    order: 1,
    active: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    _id: '2',
    title: 'Teses de Investimento para Fundos de Papel',
    description: 'Descubra as melhores oportunidades em fundos de papel e como montar uma carteira equilibrada.',
    videoId: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    order: 2,
    active: true,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    _id: '3',
    title: 'Como Analisar Fundos de Tijolo',
    description: 'Aprenda a avaliar fundos de tijolo e identificar os melhores ativos para sua carteira.',
    videoId: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    order: 3,
    active: true,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
];

/**
 * Busca todos os vídeos (Teses de Investimento)
 * @param getToken - Função para obter o token do Clerk
 */
export const fetchVideos = async (getToken: () => Promise<string | null>): Promise<ApiResponse<HomeVideo[]>> => {
  // Modo de desenvolvimento com dados mockados
  if (USE_MOCK_DATA) {
    console.log('🧪 MODO DESENVOLVIMENTO: Usando dados mockados');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede
    return { data: MOCK_VIDEOS };
  }

  try {
    const token = await getToken();
    
    console.log('🔑 Token obtido:', token ? 'Token disponível' : 'Sem token');
    
    if (!token) {
      return { error: 'Usuário não autenticado' };
    }

    // Usando API pública de user-guide-videos
    const endpoint = `${API_BASE_URL}/api/user-guide-videos`;
    console.log('📡 Fazendo requisição para:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    console.log('📥 Status da resposta:', response.status);
    console.log('📥 Headers da resposta:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      if (response.status === 401) {
        return { error: 'Não autorizado - Faça login novamente' };
      }
      if (response.status === 403) {
        return { error: 'Necessário ter um plano ativo' };
      }
      return { error: `Erro ${response.status}: ${errorText.substring(0, 100)}` };
    }

    // Verificar o content-type antes de fazer parse
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Resposta não é JSON:', text.substring(0, 200));
      return { error: 'Resposta inválida do servidor' };
    }

    const result = await response.json();
    console.log('✅ Dados recebidos:', JSON.stringify(result).substring(0, 500));
    
    // Aceitar diferentes formatos de resposta
    let videosArray: HomeVideo[] = [];
    
    if (result.videos && Array.isArray(result.videos)) {
      videosArray = result.videos;
    } else if (result.userguidevideos && Array.isArray(result.userguidevideos)) {
      videosArray = result.userguidevideos;
    } else if (Array.isArray(result)) {
      videosArray = result;
    } else {
      console.error('❌ Formato de resposta inválido:', result);
      throw new Error('Formato de resposta inválido');
    }

    console.log('📦 Total de vídeos encontrados:', videosArray.length);

    // Filtrar apenas vídeos ativos e ordenar por data
    const activeVideos = videosArray
      .filter((video: HomeVideo) => video.active)
      .sort((a: HomeVideo, b: HomeVideo) => {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return dateB - dateA;
      });

    console.log('✅ Vídeos ativos:', activeVideos.length);
    return { data: activeVideos };
  } catch (error) {
    console.error('❌ Erro ao buscar vídeos:', error);
    return { error: `Erro ao carregar vídeos: ${error instanceof Error ? error.message : 'Tente novamente'}` };
  }
};

/**
 * Busca vídeo por ID
 * @param videoId - ID do vídeo
 * @param getToken - Função para obter o token do Clerk
 */
export const fetchVideoById = async (
  videoId: string, 
  getToken: () => Promise<string | null>
): Promise<ApiResponse<HomeVideo>> => {
  try {
    const result = await fetchVideos(getToken);
    
    if (result.error || !result.data) {
      return { error: result.error || 'Erro ao buscar vídeo' };
    }

    const video = result.data.find(v => v._id === videoId);
    
    if (!video) {
      return { error: 'Vídeo não encontrado' };
    }

    return { data: video };
  } catch (error) {
    console.error('Erro ao buscar vídeo por ID:', error);
    return { error: 'Erro ao carregar vídeo. Tente novamente.' };
  }
};
