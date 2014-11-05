PORT=1338

all: run

run:
	python3 server.py $(PORT)