import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Row,
  Stack,
} from 'react-bootstrap';
import {
  BarChartFill,
  BoxArrowRight,
  BuildingFill,
  CarFrontFill,
  CheckCircleFill,
  ClockHistory,
  Clock,
  Display,
  Eraser,
  EnvelopeFill,
  GearFill,
  GeoAltFill,
  HouseDoorFill,
  HouseFill,
  InfoCircleFill,
  ListUl,
  PeopleFill,
  PersonCircle,
  PersonFill,
  PersonVcard,
  PuzzleFill,
  Save,
  Search,
  ShieldLockFill,
  TelephoneFill,
  XLg,
} from 'react-bootstrap-icons';

/* -------------------------------------------------------------------------- */
/* Dados estáticos                                                            */
/* -------------------------------------------------------------------------- */

const MENU_ITEMS = [
  { key: 'inicio', label: 'Início', icon: HouseFill, href: '/' },
  { key: 'historico', label: 'Histórico', icon: ClockHistory, href: '/historico' },
  { key: 'visitantes', label: 'Visitantes', icon: PeopleFill, href: '/visitantes' },
  { key: 'configuracoes', label: 'Configurações', icon: GearFill, href: '/configuracoes' },
  { key: 'relatorios', label: 'Relatórios', icon: BarChartFill, href: '/relatorios' },
  { key: 'sair', label: 'Sair', icon: BoxArrowRight, href: '/sair' },
];

const MOTIVOS_VISITA = [
  { value: 'reuniao', label: 'Reunião' },
  { value: 'entrega', label: 'Entrega' },
  { value: 'servico', label: 'Prestação de serviço' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'outro', label: 'Outro' },
];

const INITIAL_VALUES = {
  nomeCompleto: '',
  cpf: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  complemento: '',
  empresaOrigem: '',
  pessoaOuSetor: '',
  motivoVisita: '',
  placaVeiculo: '',
};

/* -------------------------------------------------------------------------- */
/* Subcomponentes                                                             */
/* -------------------------------------------------------------------------- */

/** Menu lateral: coluna vertical em telas >= lg, barra horizontal em mobile. */
function SideMenu({ activeKey = 'visitantes' }) {
  return (
    <Nav
      as="nav"
      variant="pills"
      activeKey={activeKey}
      className="bg-dark flex-row flex-lg-column justify-content-around justify-content-lg-start gap-lg-3 p-2 p-lg-3 h-100"
      aria-label="Navegação principal"
    >
      {MENU_ITEMS.map(({ key, label, icon: Icon, href }) => (
        <Nav.Item key={key}>
          <Nav.Link
            eventKey={key}
            href={href}
            className="d-flex flex-column align-items-center text-white small"
          >
            <Icon size={24} aria-hidden="true" />
            <span>{label}</span>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

/** Cabeçalho da página com marca, título e subtítulo. */
function PageHeader() {
  return (
    <Navbar bg="light" className="border-bottom px-3 py-3">
      <Container fluid>
        <Stack direction="horizontal" gap={3} className="flex-wrap">
          <Navbar.Brand className="fw-bold text-primary fs-3 mb-0">
            SACCHELLI
            <small className="d-block fs-6 fw-normal text-body-secondary">
              Qualidade de aço
            </small>
          </Navbar.Brand>

          <div className="vr d-none d-md-block" />

          <div>
            <h1 className="h3 fw-bold mb-0">Cadastro de Visitantes</h1>
            <p className="text-body-secondary mb-0">
              Registre as informações do visitante para controle de acesso.
            </p>
          </div>
        </Stack>
        <PeopleFill size={40} className="text-primary d-none d-lg-block" aria-hidden="true" />
      </Container>
    </Navbar>
  );
}

/**
 * Campo de formulário padronizado: Form.Group + Label + InputGroup com ícone.
 * `children` recebe o controle (Form.Control / Form.Select), permitindo
 * integrar depois com react-hook-form, Formik, etc.
 */
function FormField({ controlId, label, required = false, optional = false, icon: Icon, children }) {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label className="fw-semibold">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="fw-normal text-body-secondary"> (opcional)</span>}
      </Form.Label>
      <InputGroup>
        {Icon && (
          <InputGroup.Text>
            <Icon aria-hidden="true" />
          </InputGroup.Text>
        )}
        {children}
      </InputGroup>
      <Form.Control.Feedback type="invalid">Campo obrigatório.</Form.Control.Feedback>
    </Form.Group>
  );
}

/** Barra de status inferior com data, horário e local. */
function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Navbar bg="light" className="border-top px-3 py-2 mt-auto">
      <Container fluid className="small text-body-secondary">
        <Stack direction="horizontal" gap={3}>
          <span>
            <Clock className="me-2" aria-hidden="true" />
            Data: {now.toLocaleDateString('pt-BR')}
          </span>
          <div className="vr" />
          <span>Horário: {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </Stack>
        <span>
          <Display className="me-2" aria-hidden="true" />
          Portaria - Sacchelli
        </span>
      </Container>
    </Navbar>
  );
}

/* -------------------------------------------------------------------------- */
/* Formulário                                                                 */
/* -------------------------------------------------------------------------- */

function VisitorForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [validated, setValidated] = useState(false);
  const [cpfValido] = useState(false); // TODO: derivar da validação de CPF (schema)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity()) onSubmit?.(values);
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setValidated(false);
  };

  const handleCepSearch = () => {
    // TODO: consultar API de CEP (ex.: ViaCEP) e preencher `endereco`
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} onReset={handleReset}>
      <Row className="g-3">
        {/* Linha 1 */}
        <Col xs={12} md={6} lg={4}>
          <FormField controlId="nomeCompleto" label="Nome Completo" required icon={PersonFill}>
            <Form.Control
              type="text"
              name="nomeCompleto"
              placeholder="Digite o nome completo..."
              value={values.nomeCompleto}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField controlId="cpf" label="CPF" required icon={PersonVcard}>
            <Form.Control
              type="text"
              name="cpf"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={values.cpf}
              onChange={handleChange}
              required
            />
            {cpfValido && (
              <InputGroup.Text className="text-success">
                <CheckCircleFill aria-label="CPF válido" />
              </InputGroup.Text>
            )}
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField controlId="email" label="E-mail" required icon={EnvelopeFill}>
            <Form.Control
              type="email"
              name="email"
              placeholder="exemplo@email.com"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </FormField>
        </Col>

        {/* Linha 2 */}
        <Col xs={12} md={6} lg={4}>
          <FormField controlId="telefone" label="Telefone / Celular" icon={TelephoneFill}>
            <Form.Control
              type="tel"
              name="telefone"
              placeholder="(11) 98765-4321"
              value={values.telefone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField controlId="cep" label="CEP" required icon={GeoAltFill}>
            <Form.Control
              type="text"
              name="cep"
              inputMode="numeric"
              placeholder="00000-000"
              value={values.cep}
              onChange={handleChange}
              autoComplete="postal-code"
              required
            />
            <Button variant="primary" aria-label="Buscar CEP" onClick={handleCepSearch}>
              <Search aria-hidden="true" />
            </Button>
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField controlId="endereco" label="Endereço" icon={HouseDoorFill}>
            <Form.Control
              type="text"
              name="endereco"
              placeholder="Rua Exemplo, Nº 123"
              value={values.endereco}
              onChange={handleChange}
              readOnly
            />
          </FormField>
        </Col>

        {/* Linha 3 */}
        <Col xs={12} md={6} lg={4}>
          <FormField controlId="complemento" label="Complemento" icon={PuzzleFill}>
            <Form.Control
              type="text"
              name="complemento"
              placeholder="Apto, sala, etc."
              value={values.complemento}
              onChange={handleChange}
            />
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField controlId="empresaOrigem" label="Empresa de Origem" icon={BuildingFill}>
            <Form.Control
              type="text"
              name="empresaOrigem"
              placeholder="Digite a empresa..."
              value={values.empresaOrigem}
              onChange={handleChange}
              autoComplete="organization"
            />
          </FormField>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <FormField
            controlId="pessoaOuSetor"
            label="Pessoa ou Setor a ser Visitado"
            required
            icon={PeopleFill}
          >
            <Form.Control
              type="text"
              name="pessoaOuSetor"
              placeholder="Digite o nome ou setor..."
              value={values.pessoaOuSetor}
              onChange={handleChange}
              required
            />
          </FormField>
        </Col>

        {/* Linha 4 */}
        <Col xs={12} lg={7}>
          <FormField controlId="motivoVisita" label="Motivo da Visita" required icon={ListUl}>
            <Form.Select
              name="motivoVisita"
              value={values.motivoVisita}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o motivo da visita...</option>
              {MOTIVOS_VISITA.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </FormField>
        </Col>

        <Col xs={12} lg={5}>
          <FormField controlId="placaVeiculo" label="Placa do Veículo" optional icon={CarFrontFill}>
            <Form.Control
              type="text"
              name="placaVeiculo"
              placeholder="ABC-1234"
              maxLength={8}
              value={values.placaVeiculo}
              onChange={handleChange}
            />
          </FormField>
        </Col>

        {/* Aviso LGPD */}
        <Col xs={12}>
          <Alert variant="info" className="d-flex align-items-center justify-content-between mb-0">
            <span className="d-flex align-items-center gap-2">
              <InfoCircleFill aria-hidden="true" />
              Os dados informados serão utilizados apenas para controle de acesso, conforme a LGPD.
            </span>
            <span className="d-none d-md-flex align-items-center gap-2 text-primary">
              <ShieldLockFill size={28} aria-hidden="true" />
              <span className="lh-1">
                <strong className="d-block">LGPD</strong>
                <small>Dados protegidos</small>
              </span>
            </span>
          </Alert>
        </Col>

        {/* Ações */}
        <Col xs={12}>
          <Stack
            direction="horizontal"
            gap={3}
            className="flex-column flex-md-row justify-content-md-center"
          >
            <Button type="submit" variant="primary" className="w-100 w-md-auto">
              <Save className="me-2" aria-hidden="true" />
              Cadastrar Visitante
            </Button>
            <Button type="reset" variant="outline-primary" className="w-100 w-md-auto">
              <Eraser className="me-2" aria-hidden="true" />
              Limpar Formulário
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              className="w-100 w-md-auto"
              onClick={onCancel}
            >
              <XLg className="me-2" aria-hidden="true" />
              Cancelar
            </Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

/* -------------------------------------------------------------------------- */
/* Página                                                                     */
/* -------------------------------------------------------------------------- */

export function CadastroVisitantes() {
  const handleSubmit = (data) => {
    // TODO: integrar com a API / validação de schema (zod, yup...)
    console.log('Visitante cadastrado:', data);
  };

  const handleCancel = () => {
    // TODO: navegar para a página anterior
  };

  return (
    <Container fluid className="p-0 min-vh-100 bg-dark">
      <Row className="g-0 min-vh-100">
        {/* Sidebar: topo no mobile, lateral no desktop */}
        <Col xs={12} lg="auto" className="bg-dark">
          <SideMenu />
        </Col>

        {/* Conteúdo principal */}
        <Col className="d-flex flex-column bg-body-tertiary">
          <PageHeader />

          <main className="flex-grow-1 p-3 p-lg-4">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-3 p-lg-4">
                <Stack direction="horizontal" gap={3} className="mb-4">
                  <PersonCircle size={48} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <Card.Title as="h2" className="h3 fw-bold text-primary mb-0">
                    Dados do Visitante
                  </Card.Title>
                  <hr className="flex-grow-1 border-primary opacity-100 m-0" />
                </Stack>

                <VisitorForm onSubmit={handleSubmit} onCancel={handleCancel} />
              </Card.Body>
            </Card>
          </main>

          <StatusBar />
        </Col>
      </Row>
    </Container>
  );
}
