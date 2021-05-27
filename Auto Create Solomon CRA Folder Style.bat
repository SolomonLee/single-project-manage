@echo off
echo Auto Create Solomon CRA Folder Style: 
echo Run!
if exist src (
	cd src
	mkdir apis
	mkdir common
	mkdir css
	mkdir hooks
	mkdir images
	mkdir reducers
	mkdir route	
	mkdir components
	cd components
	mkdir combo
	mkdir elements
	mkdir pages
	
	cd ../..
	
	echo Done!
	echo In src
	echo 	Create apis, common, components, css, hooks, images, reducers, route& echo.
	echo In components
	echo 	Create combo, elements, pages
) else (
  echo Can't found folder "src"!
)
pause
		
