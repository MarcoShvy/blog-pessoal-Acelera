import { Tema } from './tema.model';
import { Usuario } from './usuarios.model'
export interface Post {
    id?: number;
    titulo: string;
    texto: string;
    usuario: Usuario;
    data: Date;
    tema: Tema;
  }
  