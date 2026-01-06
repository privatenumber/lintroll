// Mock external package with lowercase constructor
// Simulates packages like 'fdir' that have lowercase constructors
function externalPackage() {
	this.value = 'external-package';
}

export default externalPackage;