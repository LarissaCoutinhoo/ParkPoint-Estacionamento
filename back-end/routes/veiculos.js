// Importando bibliotecas necessárias
import{Router} from 'express';
import controller from '../controllers/veiculos.js';

const router = Router();

// Rotas

router.post('/', controller.create);
// Dados a serem informados
/*
    placa:  String
    cor:    String
    tipo:   String 
    modelo: String
*/

router.get('/placa/:placa', controller.retrieveOnePlaca);
// Dados a serem informados
/*
    placa Via URL
*/

router.get('/:id', controller.retrieveOne);
// Dados a serem informados
/*
    id Via URL
*/

router.get('/', controller.retrieveAll);
// Dados a serem informados
/*
    Nenhum dada a ser enviado
*/

router.put('/:id', controller.update);
// Dados a serem informados
/*
    id Via URL
    placa:  String
    cor:    String
    tipo:   String 
    modelo: String
    status: Boolean
*/

router.delete('/:id', controller.delete);
// Dados a serem informados
/*
    id Via URL
*/

export default router;