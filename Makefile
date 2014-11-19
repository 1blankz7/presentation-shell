PORT=1338
PAGE_WIDTH=21.093333333cm

all: run

pdf:
	wkhtmltopdf -T 0 -R 0 -B 0 -L 0 --page-width 21.093333333cm --page-height 13.217cm --print-media-type index.html index.pdf

run:
	python3 server.py $(PORT)