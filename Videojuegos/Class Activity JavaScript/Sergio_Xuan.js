/*
 * Functions for the homework assignment
 *
 * Sergio Xuan
 * 02/04/2025
 */

// 1. firstNonRepeating
// Encontrar ek primer carácter que no se repite en una cadena
export function firstNonRepeating(str) {
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let repeated = false;
        for (let j = 0; j < str.length; j++) {
            if (char === str[j] && i !== j) {
                repeated = true;
                break;
            }
        }
        if (!repeated) {
            return char;
        }
    }
    return undefined;
}

// 2. bubbleSort
// Ordena un arreglo de menor a mayor usando Bubble Sort
export function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// 3.1 invertArray
// Invierte un arreglo y regresa uno nuevo
export function invertArray(arr) {
    let result = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}

// 3.2 invertArrayInplace
// Invertir el arreglo
export function invertArrayInplace(arr) {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}

// 4. capitalize
// Convierte la primera letra de cada palabra a mayúscula
export function capitalize(str) {
    let result = "";
    let capitalizeNext = true;

    for (let i = 0; i < str.length; i++) {
        let char = str[i];

        if (capitalizeNext && char >= 'a' && char <= 'z') {
            result += char.toUpperCase(); // convierte solo esta letra
        } else {
            result += char;
        }

        // Si hay un espacio, la siguiente letra debe ir en mayúscula
        capitalizeNext = (char === " ");
    }

    return result;
}

// 5. mcd
// Calcula el máximo común divisor
export function mcd(a, b) {
    if (a === 0 && b === 0) return 0;
    // Mientras que b no sea 0 (residuo), sigue el algoritmo 
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    if (a < 0) {
        return -a;
    } else {
        return a;
    }
}

// 6. hackerSpeak
// Reemplaza letras por números estilo hacker speak
export function hackerSpeak(str) {
    let result = "";

    for (let i = 0; i < str.length; i++) {
        let c = str[i].toUpperCase(); // <- convertimos a mayúscula

        switch (c) {
            case 'A':
                result += '4';
                break;
            case 'E':
                result += '3';
                break;
            case 'I':
                result += '1';
                break;
            case 'O':
                result += '0';
                break;
            case 'S':
                result += '5';
                break;
            default:
                result += str[i]; // usamos el original para mantener mayúsculas/minúsculas
        }
    }
    return result;
}


// 7. factorize
// Devuelve todos los factores de un número
export function factorize(num) {
    if (num === 0) return [];
    let result = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            result.push(i);
        }
    }
    return result;
}

// 8. deduplicate
// Elimina duplicados de un arreglo sin usar Set
export function deduplicate(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let exists = false;
        for (let j = 0; j < result.length; j++) {
            if (arr[i] === result[j]) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            result.push(arr[i]);
        }
    }
    return result;
}

// 9. findShortestString
// Regresa la longitud de la cadena más corta
export function findShortestString(arr) {
    if (arr.length === 0) return 0;
    let minLength = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length < minLength) {
            minLength = arr[i].length;
        }
    }
    return minLength;
}

// 10. isPalindrome
// Verifica si una cadena es un palíndromo
export function isPalindrome(str) {
    let start = 0;
    let end = str.length - 1;
    while (start < end) {
        if (str[start] !== str[end]) {
            return false;
        }
        start++; // Incrementamos tanto el inicio como el final cerrando el palíndromo
        end--;
    }
    return true;
}

// 11. sortStrings
// Ordena alfabéticamente cadenas sin usar .sort()
export function sortStrings(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// 12. stats
// Calcula promedio y moda de un arreglo
export function stats(arr) {
    if (arr.length === 0) return [0, 0];
    let sum = 0;
    let counts = {};
    for (let i = 0; i < arr.length; i++) {
        let num = arr[i];
        sum += num;
        if (counts[num] === undefined) {
            counts[num] = 1; // Numeros nuevos
        } else {
            counts[num]++; // Numeros repetidos
        }
    }
    let maxCount = 0; // La frecuencia más alta que hemos visto hasta ahora
    let mode = arr[0]; // empezamos asumiendo que el primer número es la moda
    for (let key in counts) {
        if (counts[key] > maxCount) { // ejemplo: counts[1] > 0, cambiamos la moda y maxCount, despues si es counts[2] > 1, cambiamos la moda y maxCount, asi continuamente
            maxCount = counts[key]; 
            mode = Number(key);
        }
    }
    return [sum / arr.length, mode]; // Regresamos el promedio y la moda
}

// 13. popularString
// Muy parecido al anterior
// Devuelve la cadena que más veces aparece
export function popularString(arr) {
    if (arr.length === 0) return "";
    let counts = {};
    for (let i = 0; i < arr.length; i++) {
        let word = arr[i];
        if (counts[word] === undefined) {
            counts[word] = 1;
        } else {
            counts[word]++;
        }
    }
    let maxCount = 0;
    let result = arr[0];
    for (let key in counts) {
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            result = key;
        }
    }
    return result;
}

// 14. isPowerOf2
// Revisa si un número es potencia de 2
export function isPowerOf2(num) {
    if (num < 1) return false;
    while (num > 1) {
        if (num % 2 !== 0) return false;
        num = num / 2;
    }
    return true;
}

// 15. sortDescending
// Ordena números de mayor a menor sin usar .sort()
export function sortDescending(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j] < arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
