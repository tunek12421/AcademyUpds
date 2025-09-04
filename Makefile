all:
	@echo "Instalando dependencias... "
	@npm install
	@echo "Compilando Tailwind CSS..."
	@npx tailwindcss -i ./input.css -o ./src/assets/css/styles/tailwind.css
	@echo "Compilando pagina."
	@npm run build
	@echo "Compilación completada."
	@npm run preview