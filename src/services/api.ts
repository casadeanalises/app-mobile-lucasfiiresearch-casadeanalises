import { HomeVideo } from '../types/video';
import { Report } from '../screens/weekly-reports/types';

const API_BASE_URL = 'https://lucasfiiresearch.dev.br';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Busca todos os vídeos (Teses de Investimento)
 * @param getToken - Função para obter o token do Clerk
 */
export const fetchVideos = async (): Promise<ApiResponse<HomeVideo[]>> => {
  try {
    // Usando API pública de vídeos (não requer autenticação)
    const endpoint = `${API_BASE_URL}/api/videos`;
    console.log('📡 Fazendo requisição para:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
  videoId: string
): Promise<ApiResponse<HomeVideo>> => {
  try {
    const result = await fetchVideos();
    
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

/**
 * Busca todos os relatórios semanais em PDF
 * @param getToken - Função para obter o token do Clerk
 */
export const fetchReports = async (): Promise<ApiResponse<Report[]>> => {
  try {
    // Usando API pública de relatórios (não requer autenticação)
    const endpoint = `${API_BASE_URL}/api/reports/pdfs/`;
    console.log('📡 Fazendo requisição para:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta (relatórios):', response.status);

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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Resposta não é JSON:', text.substring(0, 200));
      return { error: 'Resposta inválida do servidor' };
    }

    const result = await response.json();
    console.log('✅ Relatórios recebidos:', JSON.stringify(result).substring(0, 500));
    
    let reportsArray: Report[] = [];
    
    if (result.updateschedulepdfs && Array.isArray(result.updateschedulepdfs)) {
      reportsArray = result.updateschedulepdfs;
    } else if (result.reports && Array.isArray(result.reports)) {
      reportsArray = result.reports;
    } else if (Array.isArray(result)) {
      reportsArray = result;
    } else {
      console.error('❌ Formato de resposta inválido:', result);
      return { error: 'Formato de resposta inválido' };
    }

    console.log('📦 Total de relatórios encontrados:', reportsArray.length);

    // Ordenar por data (mais recentes primeiro)
    const sortedReports = reportsArray.sort((a: Report, b: Report) => {
      const dateA = new Date(a.date || a.createdAt || '').getTime();
      const dateB = new Date(b.date || b.createdAt || '').getTime();
      return dateB - dateA;
    });

    console.log('✅ Relatórios ordenados:', sortedReports.length);
    return { data: sortedReports };
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios:', error);
    return { error: `Erro ao carregar relatórios: ${error instanceof Error ? error.message : 'Tente novamente'}` };
  }
};
