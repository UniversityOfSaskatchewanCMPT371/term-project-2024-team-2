#!/bin/bash

ID_PATH=$1

pdfs=$(ls ${ID_PATH} | grep pdf)

for file in ${pdfs}; do
    no_under_score_file=$(echo ${file} | sed 's/_/ /g')
    name=$(echo ${no_under_score_file} | sed 's/.*/\L&/; s/[a-z]*/\u&/g')
    cap_id=$(echo ${name} | sed 's/Id/ID/g')
    stripped_pdf=$(echo ${cap_id} | sed 's/.Pdf//g')
    echo "- [${stripped_pdf}](./${file})"
done
