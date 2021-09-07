const fs = require('fs')
const attributesToKeep = ['name', 'dependencies', 'devDependencies']
const packageJson = require('./package')
const transformedFileName = 'package-docker.json'

const transformedPackage = {}
attributesToKeep.forEach(attribute => {
  transformedPackage[attribute] = packageJson[attribute]
})

fs.writeFileSync(transformedFileName, JSON.stringify(transformedPackage, null, 2))
