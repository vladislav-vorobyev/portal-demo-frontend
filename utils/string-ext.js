export const matchedName = function (str, pattern) {
  if (typeof str !== typeof pattern) {
    return false
  }
  return str.toLowerCase().match(pattern.toLowerCase())
}

export const capitalizeFirstLetter = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const testSlug = function (str) {
  return /^[a-z0-9_-]*$/i.test(str)
}

export const cleanupSlug = function (str) {
  return str.replace(/([^a-z0-9_-]+)/gi, '')
}

export const convertToSlug = function (str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
  const to = 'abvgdeegziiklmnoprstufhcczz-y-euaaaaaaeeeeeiiiiooooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  // final cleanup
  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

/**
 * Transliterate a name by Russian standard 2022
 * (https://www.gosuslugi.ru/help/faq/foreign_passport/100359)
 * @param {string} str FIO
 */
export const translitRusToZagran = function (str) {
  const arr = str.split('').map((c) => {
    if (/[а-я]/.test(c)) {
      return translitMap[c] ?? ''
    }
    if (/[А-Я]/.test(c)) {
      return capitalizeFirstLetter(translitMap[c.toLowerCase()] ?? '')
    }
    return c
  })
  return ''.concat(...arr)
}
// prettier-ignore
const translitMap = {
  // eslint-disable-next-line prettier/prettier
  'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'e', 'ж':'zh', 'з':'z', 'и':'i', 'й':'i', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
  // eslint-disable-next-line prettier/prettier
  'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'кh', 'ц':'ts', 'ч':'сh', 'ш':'sh', 'щ':'shch', 'ы':'y', 'ъ':'ie', 'э':'e', 'ю':'iu', 'я':'ia'
}
