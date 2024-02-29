/* eslint-disable */
// @ts-nocheck

export class LDA {
  // Number of topics
  K: number;
  // Alpha parameter
  alpha: number;
  // Beta parameter
  beta: number;
  // Vocabulary size
  V: number;

  //Topic-word distributions
  theta: number[][];
  //Word-topic distributions
  phi: number[][];

  //Document-topic distributions
  gamma: number[][];

  constructor(K: number, alpha: number, beta: number, V: number) {
    this.K = K;
    this.alpha = alpha;
    this.beta = beta;
    this.V = V;

    this.theta = [];
    this.phi = [];
    this.gamma = [];
  }

  // Compute theta, phi and gamma
  train(docs: number[][], seedTheta?: number[][]) {
    // Initialize theta and phi
    this.theta = seedTheta || this.randomTheta();
    this.phi = this.randomPhi();

    // E-step: Compute gamma
    for (let doc of docs) {
      let topicDist = this.inferTopics(doc);
      this.gamma.push(topicDist);
    }

    // M-step: Update theta and phi
    this.updateThetaPhi();
  }

  // Make a random initialization of theta
  randomTheta() {
    let theta = [];
    for (let k = 0; k < this.K; k++) {
      let topic = [];
      for (let v = 0; v < this.V; v++) {
        topic.push(1 / this.V);
      }
      theta.push(topic);
    }
    return theta;
  }

  // Make a random initialization of phi
  randomPhi() {
    let phi = [];
    for (let k = 0; k < this.K; k++) {
      let topic = [];
      for (let w = 0; w < this.V; w++) {
        topic.push(1 / this.V);
      }
      phi.push(topic);
    }
    return phi;
  }

  // Infer topic distribution for a document
  inferTopics(doc: number[]) {
    let topicDist = [];
    for (let k = 0; k < this.K; k++) {
      let p = this.theta[k].reduce(
        (a, b, i) => a + b * doc.filter((w) => w === i).length,
        0,
      );
      topicDist.push(p);
    }
    return topicDist;
  }

  // Update theta and phi
  updateThetaPhi() {
    // Update theta
    for (let k = 0; k < this.K; k++) {
      let num = this.alpha + this.gamma.reduce((a, b) => a + b[k], 0);
      let den =
        this.alpha * this.V +
        this.gamma.reduce((a, b) => a + b.reduce((c, d) => c + d, 0), 0);
      this.theta[k] = this.theta[k].map((p) => (p * num) / den);
    }

    // Update phi
    for (let k = 0; k < this.K; k++) {
      for (let w = 0; w < this.V; w++) {
        let num = 0;
        for (let d = 0; d < this.gamma.length; d++) {
          num += this.gamma[d][k] * this.gamma[d].filter((v) => v === w).length;
        }
        let den =
          this.beta + this.gamma.reduce((a, b) => a + b[k] * b.length, 0);
        this.phi[k][w] = num / den;
      }
    }
  }
}
