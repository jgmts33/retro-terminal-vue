import jsBinaries from './*.js'
import vueBinaries from './*.vue'

export const isShellBinary = (binary) => typeof binary.default === 'function'

export default { ...jsBinaries, ...vueBinaries }
