all: tailwind
	@echo "Compilando pagina."
	@npm run build
	@echo "Compilación completada."
	@npm run preview

debug: tailwind
	@npm run dev

tailwind:
	@echo "Compilando Tailwind CSS..."
	@npx tailwindcss -i ./input.css -o ./src/assets/css/styles/tailwind.css

init:
	@echo "Instalando dependencias... "
	@npm install