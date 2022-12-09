#!/bin/sh

mkdir ./data/$1;
mkdir ./src/$1;
touch ./data/$1/$1-$2.txt;
touch ./src/$1/01-$2.md;
touch ./src/$1/01-$2.ts;
touch ./src/$1/02-$2.md;
touch ./src/$1/02-$2.ts;