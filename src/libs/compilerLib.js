const appConfig = require('../../config/appConfig');
const fs = require('fs');
const path = require('path');
const eventEmitter = appConfig.eventEmitter;


let generateCommand = async (id, lang, code) => {
    try {
        let job_id = id + '_' + lang;
        let filename = job_id + '.' + lang;
        let dir = process.cwd() + '/execute/' + id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        let file_path = path.join(dir + '/' + filename);
        let str = fs.createWriteStream(file_path, { flags: 'w+' });
        str.write(code);
        str.end();
        let command = '';
        switch (lang) {
            case 'js':
                command = `node ${file_path}`;
                break;
            case 'php':
                command = `php ${file_path}`;
                break;
            case 'cs':
                let executable = filename + '.exe';
                let exe_path = path.join(dir + executable);
                command = `mcs -out:${exe_path} ${file_path} && mono ${exe_path}`;
                break;
        }
        return {
            job_id: job_id,
            command: command,
            file_path: file_path
        }
    } catch (err) {
        throw err;
    }
}
let compile = async (job_id, command) => {
    try {
        const { spawn } = require('child_process');
        const child = spawn(command, [], { shell: true });
        let output = {
            runtime_err: false,
            stdout: null,
            stderr: null
        }
        child.stdout.on('data', (data) => {
            output.stdout = data.toString();
            console.log('output', output)
        });

        child.stderr.on('data', (data) => {
            output.runtime_err = true;
            output.stderr = data.toString();
            console.log('output', output)
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            eventEmitter.emit(`${job_id}`, output);
        });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    compile: compile,
    generateCommand: generateCommand
}