import { useToast, TYPE, POSITION} from 'vue-toastification';


export const showToast = (message: string, color: string, time: number, position: POSITION) => {
    const toast = useToast();
    toast(message, {
        type : color as TYPE,
        timeout: time,
        position: position,
    });
};
export { POSITION };

/*
https://github.com/Maronato/vue-toastification
Ejemplo para usarlo Recuerden importar este archivo en la vista 
import { showToast, POSITION } from '../../stores/toast';
showToast('El mensaje a mostrar', 'success', 3000, POSITION.BOTTOM_RIGHT)
*/

/*
Colores que pueden usar
TYPE.DEFAULT: Color por defecto.
TYPE.SUCCESS: Color de éxito (verde).
TYPE.ERROR: Color de error (rojo).
TYPE.WARNING: Color de advertencia (amarillo).
TYPE.INFO: Color de información (azul claro).
*/

/*
Posiciones don puede aparecer el mensaje
POSITION.TOP_LEFT: superior izquierda.
POSITION.TOP_RIGHT: superior derecha.
POSITION.TOP_CENTER: superior central.
POSITION.BOTTOM_LEFT: inferior izquierda.
POSITION.BOTTOM_RIGHT: inferior derecha.
POSITION.BOTTOM_CENTER: inferior central.
POSITION.CENTER: el centro.
*/