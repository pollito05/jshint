build_dir:
	@mkdir -p "build"

rhino: build_dir
	@echo "Building JSHint for Rhino"
	@cat "jshint.js" > "build/jshint-rhino.js" && \
		cat "src/env/rhino.js" >> "build/jshint-rhino.js" && \
		echo "Done"

jsc: build_dir
	@mkdir -p "build/jsc"
	@echo "Building JSHint for JavaScriptCore shell"
	@cat "jshint.js" > "build/jsc/jsc.js" && \
		cat "src/env/jsc.js" >> "build/jsc/jsc.js" && \
		cp "src/env/jsc.py" "build/jsc/jshint.py" && \
		echo "Done"

test:
	@echo "Running all tests"
	@expresso tests/*.js

clean:
	@echo "Cleaning"
	@rm -f build/*.js && echo "Done"
